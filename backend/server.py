from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import aiomysql
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
import secrets
import string
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MySQL connection pool
db_pool = None

async def get_db_pool():
    """Get MySQL connection pool"""
    global db_pool
    if db_pool is None:
        db_pool = await aiomysql.create_pool(
            host=os.environ.get('MYSQL_HOST', 'localhost'),
            port=int(os.environ.get('MYSQL_PORT', 3306)),
            user=os.environ.get('MYSQL_USER', 'root'),
            password=os.environ.get('MYSQL_PASSWORD', ''),
            db=os.environ.get('MYSQL_DB', 'platinum_network'),
            autocommit=True,
            minsize=1,
            maxsize=10
        )
    return db_pool

# Create the main app without a prefix
app = FastAPI(title="Platinum Network API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'platinum-network-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== STARTUP/SHUTDOWN ====================

@app.on_event("startup")
async def startup():
    """Initialize database pool on startup"""
    await get_db_pool()
    logger.info("MySQL connection pool created")

@app.on_event("shutdown")
async def shutdown():
    """Close database pool on shutdown"""
    global db_pool
    if db_pool:
        db_pool.close()
        await db_pool.wait_closed()
        logger.info("MySQL connection pool closed")


# ==================== UTILITY FUNCTIONS ====================

def generate_referral_code(length=8):
    """Generate a unique referral code"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = await cursor.fetchone()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ==================== MODELS ====================

class UserRegister(BaseModel):
    username: str
    name: str
    email: EmailStr
    password: str
    confirm_password: str
    referral_code: Optional[str] = None
    agree_terms: bool = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    full_name: str
    email: EmailStr
    hashed_password: str
    referral_code: str = Field(default_factory=lambda: generate_referral_code())
    referred_by: Optional[str] = None
    total_pnrp: float = 0.0
    level: int = 1
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    """Register a new user"""
    # Validate passwords match
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Check if username exists
            await cursor.execute("SELECT id FROM users WHERE username = %s", (user_data.username,))
            if await cursor.fetchone():
                raise HTTPException(status_code=400, detail="Username already exists")
            
            # Check if email exists
            await cursor.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
            if await cursor.fetchone():
                raise HTTPException(status_code=400, detail="Email already exists")
            
            # Validate referral code if provided
            referrer_id = None
            if user_data.referral_code:
                await cursor.execute("SELECT id FROM users WHERE referral_code = %s", (user_data.referral_code,))
                referrer = await cursor.fetchone()
                if not referrer:
                    raise HTTPException(status_code=400, detail="Invalid referral code")
                referrer_id = referrer["id"]
            
            # Create user
            user_id = str(uuid.uuid4())
            referral_code = generate_referral_code()
            hashed_pwd = hash_password(user_data.password)
            created_at = datetime.now(timezone.utc)
            
            await cursor.execute(
                """INSERT INTO users (id, username, full_name, email, hashed_password, 
                   referral_code, referred_by, total_pnrp, level, is_admin, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (user_id, user_data.username, user_data.name, user_data.email, hashed_pwd,
                 referral_code, referrer_id, 0.0, 1, False, created_at)
            )
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": user_data.username,
            "name": user_data.name,
            "email": user_data.email,
            "referral_code": referral_code,
            "total_pnrp": 0.0
        }
    }


@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    """Login user"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("SELECT * FROM users WHERE email = %s", (login_data.email,))
            user = await cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "name": user["full_name"],
            "email": user["email"],
            "referral_code": user["referral_code"],
            "total_pnrp": float(user["total_pnrp"]),
            "is_admin": bool(user.get("is_admin", 0))
        }
    }


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "name": current_user["full_name"],
        "email": current_user["email"],
        "referral_code": current_user["referral_code"],
        "total_pnrp": float(current_user["total_pnrp"]),
        "level": current_user["level"],
        "is_admin": bool(current_user.get("is_admin", 0)),
        "created_at": current_user["created_at"].isoformat() if isinstance(current_user["created_at"], datetime) else current_user["created_at"]
    }


# ==================== MINING ROUTES ====================

@api_router.get("/mining/status")
async def get_mining_status(current_user: dict = Depends(get_current_user)):
    """Get current mining session status"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(
                """SELECT * FROM mining_sessions 
                   WHERE user_id = %s AND status IN ('active', 'completed')
                   ORDER BY start_time DESC LIMIT 1""",
                (current_user["id"],)
            )
            session = await cursor.fetchone()
    
    if not session:
        return {"has_active_session": False, "session": None}
    
    # Calculate end time
    start_time = session['start_time']
    
    # Make datetime timezone-aware if it's naive (from MySQL)
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
    
    if session['end_time']:
        end_time = session['end_time']
        if end_time.tzinfo is None:
            end_time = end_time.replace(tzinfo=timezone.utc)
    else:
        # Calculate based on duration (12h base, 24h if time_boost_ads_watched >= 2)
        duration_hours = 24 if session['time_boost_ads_watched'] >= 2 else 12
        end_time = start_time + timedelta(hours=duration_hours)
    
    # Check if completed
    now = datetime.now(timezone.utc)
    is_completed = now >= end_time
    
    if is_completed and session['status'] == 'active':
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute(
                    "UPDATE mining_sessions SET status = 'completed' WHERE id = %s",
                    (session["id"],)
                )
        session['status'] = 'completed'
    
    return {
        "has_active_session": True,
        "session": {
            "id": session['id'],
            "user_id": session['user_id'],
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "base_reward": float(session['base_reward']),
            "status": session['status'],
            "time_boost_ads_watched": session['time_boost_ads_watched'],
            "speed_boost_ads_watched": session['speed_boost_ads_watched'],
            "speed_multiplier": float(session['speed_multiplier']),
            "is_completed": is_completed,
            "time_remaining_seconds": max(0, int((end_time - now).total_seconds()))
        }
    }


@api_router.post("/mining/start")
async def start_mining(current_user: dict = Depends(get_current_user)):
    """Start a new mining session"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Check if user already has an active session
            await cursor.execute(
                """SELECT id FROM mining_sessions 
                   WHERE user_id = %s AND status IN ('active', 'completed')""",
                (current_user["id"],)
            )
            existing_session = await cursor.fetchone()
            
            if existing_session:
                raise HTTPException(status_code=400, detail="You already have an active mining session. Please claim it first.")
            
            # Create new mining session
            session_id = str(uuid.uuid4())
            start_time = datetime.now(timezone.utc)
            
            await cursor.execute(
                """INSERT INTO mining_sessions 
                   (id, user_id, start_time, base_reward, status, time_boost_ads_watched, 
                    speed_boost_ads_watched, speed_multiplier, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (session_id, current_user["id"], start_time, 50.0, 'active', 0, 0, 1.0, start_time)
            )
    
    return {
        "message": "Mining started successfully",
        "session": {
            "id": session_id,
            "user_id": current_user["id"],
            "start_time": start_time.isoformat(),
            "duration_hours": 12,
            "base_reward": 50.0,
            "speed_multiplier": 1.0,
            "total_reward": 50.0,
            "status": "active",
            "time_boost_ads_watched": 0,
            "speed_boost_ads_watched": 0,
            "end_time": (start_time + timedelta(hours=12)).isoformat()
        }
    }


@api_router.post("/mining/claim")
async def claim_mining(current_user: dict = Depends(get_current_user)):
    """Claim mining rewards"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(
                """SELECT * FROM mining_sessions 
                   WHERE user_id = %s AND status = 'completed'
                   ORDER BY start_time DESC LIMIT 1""",
                (current_user["id"],)
            )
            session = await cursor.fetchone()
    
    if not session:
        raise HTTPException(status_code=400, detail="No completed mining session to claim")
    
    # Calculate reward
    time_boost_multiplier = 2.0 if session['time_boost_ads_watched'] >= 2 else 1.0
    reward = session['base_reward'] * time_boost_multiplier * session['speed_multiplier']
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Update user balance
            await cursor.execute(
                "UPDATE users SET total_pnrp = total_pnrp + %s WHERE id = %s",
                (reward, current_user["id"])
            )
            
            # Mark session as claimed
            await cursor.execute(
                "UPDATE mining_sessions SET status = 'claimed', end_time = %s WHERE id = %s",
                (datetime.now(timezone.utc), session["id"])
            )
            
            # Give referral bonus (10% to referrer)
            if current_user.get("referred_by"):
                referral_bonus = reward * 0.1
                await cursor.execute(
                    "UPDATE users SET total_pnrp = total_pnrp + %s WHERE id = %s",
                    (referral_bonus, current_user["referred_by"])
                )
                
                # Create referral reward record
                await cursor.execute(
                    """INSERT INTO referral_rewards (id, referrer_id, referred_user_id, reward_amount, reward_type, created_at)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (str(uuid.uuid4()), current_user["referred_by"], current_user["id"], 
                     referral_bonus, "mining", datetime.now(timezone.utc))
                )
    
    return {
        "message": "Mining rewards claimed successfully",
        "reward": reward,
        "new_balance": float(current_user["total_pnrp"]) + reward
    }


@api_router.post("/mining/watch-ad")
async def watch_ad(ad_type: str, current_user: dict = Depends(get_current_user)):
    """Watch an ad to boost mining"""
    if ad_type not in ["time_boost", "speed_boost"]:
        raise HTTPException(status_code=400, detail="Invalid ad type")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Get active mining session
            await cursor.execute(
                """SELECT * FROM mining_sessions 
                   WHERE user_id = %s AND status = 'active'
                   ORDER BY start_time DESC LIMIT 1""",
                (current_user["id"],)
            )
            session = await cursor.fetchone()
    
    if not session:
        raise HTTPException(status_code=400, detail="No active mining session")
    
    if ad_type == "time_boost":
        if session['time_boost_ads_watched'] >= 2:
            raise HTTPException(status_code=400, detail="Maximum time boost ads already watched")
        
        new_count = session['time_boost_ads_watched'] + 1
        
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute(
                    "UPDATE mining_sessions SET time_boost_ads_watched = %s WHERE id = %s",
                    (new_count, session["id"])
                )
                
                # Record ad interaction
                await cursor.execute(
                    """INSERT INTO ad_interactions (id, user_id, ad_type, interaction_type, reward_pnrp, created_at)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (str(uuid.uuid4()), current_user["id"], "time_boost", "watched", 0.0, datetime.now(timezone.utc))
                )
        
        message = f"Ad watched ({new_count}/2 for time boost)"
        if new_count == 2:
            message = "Time boost activated! Mining duration extended to 24 hours"
    
    elif ad_type == "speed_boost":
        if session['speed_boost_ads_watched'] >= 5:
            raise HTTPException(status_code=400, detail="Maximum speed boost ads already watched")
        
        new_count = session['speed_boost_ads_watched'] + 1
        
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute(
                    "UPDATE mining_sessions SET speed_boost_ads_watched = %s WHERE id = %s",
                    (new_count, session["id"])
                )
                
                if new_count == 5:
                    await cursor.execute(
                        "UPDATE mining_sessions SET speed_multiplier = 2.0 WHERE id = %s",
                        (session["id"],)
                    )
                
                # Record ad interaction
                await cursor.execute(
                    """INSERT INTO ad_interactions (id, user_id, ad_type, interaction_type, reward_pnrp, created_at)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (str(uuid.uuid4()), current_user["id"], "speed_boost", "watched", 0.0, datetime.now(timezone.utc))
                )
        
        message = f"Ad watched ({new_count}/5 for speed boost)"
        if new_count == 5:
            message = "Speed boost activated! Mining speed is now 2x"
    
    return {"message": message, "ads_watched": new_count}


# ==================== DAILY REWARD ROUTES ====================

@api_router.get("/daily-reward/status")
async def get_daily_reward_status(current_user: dict = Depends(get_current_user)):
    """Get daily reward status - 3 ads per day"""
    today = datetime.now(timezone.utc).date()
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Count how many ads claimed today
            await cursor.execute(
                """SELECT COUNT(*) as count FROM daily_rewards 
                   WHERE user_id = %s AND DATE(claimed_at) = %s""",
                (current_user["id"], today)
            )
            result = await cursor.fetchone()
            ads_claimed_today = result['count']
    
    # 3 ads per day with different rewards
    reward_amounts = {1: 15, 2: 25, 3: 40}
    
    # Calculate next reward
    if ads_claimed_today >= 3:
        # All 3 ads claimed today
        current_ad = ads_claimed_today  # Will be 3
        can_claim = False
        next_reward = 0
    else:
        # Can claim next ad
        current_ad = ads_claimed_today  # 0, 1, or 2
        can_claim = True
        next_reward = reward_amounts[ads_claimed_today + 1]
    
    return {
        "current_streak": current_ad,  # Using current_streak for X/3 display (0, 1, 2, or 3)
        "can_claim": can_claim,
        "next_reward": next_reward,
        "ads_claimed_today": ads_claimed_today,
        "total_ads_per_day": 3
    }


@api_router.post("/daily-reward/watch-ad")
async def watch_daily_reward_ad(current_user: dict = Depends(get_current_user)):
    """Watch ad for daily reward - 3 ads per day (15, 25, 40 PNRP)"""
    today = datetime.now(timezone.utc).date()
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Count ads claimed today
            await cursor.execute(
                """SELECT COUNT(*) as count FROM daily_rewards 
                   WHERE user_id = %s AND DATE(claimed_at) = %s""",
                (current_user["id"], today)
            )
            result = await cursor.fetchone()
            ads_claimed_today = result['count']
            
            if ads_claimed_today >= 3:
                raise HTTPException(status_code=400, detail="All 3 daily ads already watched today")
            
            # Current ad number (1, 2, or 3)
            current_ad = ads_claimed_today + 1
            
            # Get reward for current ad
            reward_amounts = {1: 15, 2: 25, 3: 40}
            reward = reward_amounts[current_ad]
            
            # Create reward record
            await cursor.execute(
                """INSERT INTO daily_rewards (id, user_id, reward_date, day_number, reward_amount, ad_watched, claimed_at)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (str(uuid.uuid4()), current_user["id"], today, current_ad, reward, True, datetime.now(timezone.utc))
            )
            
            # Update user balance
            await cursor.execute(
                "UPDATE users SET total_pnrp = total_pnrp + %s WHERE id = %s",
                (reward, current_user["id"])
            )
            
            # Record ad interaction
            await cursor.execute(
                """INSERT INTO ad_interactions (id, user_id, ad_type, interaction_type, reward_pnrp, created_at)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (str(uuid.uuid4()), current_user["id"], f"daily_reward_ad{current_ad}", "watched", reward, datetime.now(timezone.utc))
            )
    
    return {
        "message": f"Ad {current_ad}/3 reward claimed successfully!",
        "day_number": current_ad,
        "reward": reward,
        "new_balance": float(current_user["total_pnrp"]) + reward
    }


# ==================== SOCIAL TASKS ROUTES ====================

@api_router.get("/social-tasks")
async def get_social_tasks(current_user: dict = Depends(get_current_user)):
    """Get all social tasks with completion status"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Get all tasks
            await cursor.execute("SELECT * FROM social_tasks WHERE is_active = TRUE")
            tasks = await cursor.fetchall()
            
            # Get user's completed tasks
            await cursor.execute(
                "SELECT task_id FROM user_social_tasks WHERE user_id = %s",
                (current_user["id"],)
            )
            completed_tasks = await cursor.fetchall()
            completed_task_ids = {t["task_id"] for t in completed_tasks}
    
    tasks_with_status = []
    for task in tasks:
        tasks_with_status.append({
            "id": task["id"],
            "platform": task["platform"],
            "task_name": task["task_name"],
            "reward": float(task["reward_amount"]),
            "url": task["task_url"],
            "completed": task["id"] in completed_task_ids
        })
    
    return {"tasks": tasks_with_status}


@api_router.post("/social-tasks/{task_id}/complete")
async def complete_social_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Complete a social task"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Check if task exists
            await cursor.execute("SELECT * FROM social_tasks WHERE id = %s", (task_id,))
            task = await cursor.fetchone()
            
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
            
            # Check if already completed
            await cursor.execute(
                "SELECT id FROM user_social_tasks WHERE user_id = %s AND task_id = %s",
                (current_user["id"], task_id)
            )
            if await cursor.fetchone():
                raise HTTPException(status_code=400, detail="Task already completed")
            
            # Mark task as completed
            await cursor.execute(
                """INSERT INTO user_social_tasks (id, user_id, task_id, completed_at)
                   VALUES (%s, %s, %s, %s)""",
                (str(uuid.uuid4()), current_user["id"], task_id, datetime.now(timezone.utc))
            )
            
            # Update user balance
            reward = float(task["reward_amount"])
            await cursor.execute(
                "UPDATE users SET total_pnrp = total_pnrp + %s WHERE id = %s",
                (reward, current_user["id"])
            )
    
    return {
        "message": "Social task completed successfully",
        "reward": reward,
        "new_balance": float(current_user["total_pnrp"]) + reward
    }


# ==================== REFERRALS ROUTES ====================

@api_router.get("/referrals")
async def get_referrals(current_user: dict = Depends(get_current_user)):
    """Get referral statistics"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Get referred users
            await cursor.execute(
                """SELECT username, full_name, created_at, total_pnrp 
                   FROM users WHERE referred_by = %s ORDER BY created_at DESC""",
                (current_user["id"],)
            )
            referrals = await cursor.fetchall()
            
            # Get total earnings from referrals
            await cursor.execute(
                """SELECT SUM(reward_amount) as total FROM referral_rewards 
                   WHERE referrer_id = %s""",
                (current_user["id"],)
            )
            result = await cursor.fetchone()
            total_earned = float(result["total"]) if result["total"] else 0.0
    
    referrals_list = []
    for ref in referrals:
        referrals_list.append({
            "username": ref["username"],
            "name": ref["full_name"],
            "joined_date": ref["created_at"].isoformat() if isinstance(ref["created_at"], datetime) else ref["created_at"],
            "total_pnrp": float(ref["total_pnrp"])
        })
    
    return {
        "referral_code": current_user["referral_code"],
        "total_referrals": len(referrals_list),
        "total_earned": total_earned,
        "referrals": referrals_list
    }


# ==================== WALLET ROUTES ====================

@api_router.get("/wallet")
async def get_wallet(current_user: dict = Depends(get_current_user)):
    """Get wallet information with transaction history"""
    pool = await get_db_pool()
    transactions = []
    
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Get mining rewards
            await cursor.execute(
                """SELECT id, base_reward, speed_multiplier, created_at 
                   FROM mining_sessions 
                   WHERE user_id = %s AND status = 'completed'
                   ORDER BY created_at DESC 
                   LIMIT 50""",
                (current_user["id"],)
            )
            mining = await cursor.fetchall()
            for m in mining:
                reward = float(m["base_reward"]) * float(m["speed_multiplier"])
                transactions.append({
                    "id": f"mine_{m['id']}",
                    "amount": reward,
                    "type": "mining",
                    "description": f"Mining Reward ({reward} PNRP)",
                    "created_at": m["created_at"].isoformat() if m["created_at"] else None
                })
            
            # Get daily check-in rewards
            await cursor.execute(
                """SELECT id, reward_amount, day_number, claimed_at 
                   FROM daily_rewards 
                   WHERE user_id = %s 
                   ORDER BY claimed_at DESC 
                   LIMIT 50""",
                (current_user["id"],)
            )
            daily = await cursor.fetchall()
            for d in daily:
                transactions.append({
                    "id": f"daily_{d['id']}",
                    "amount": float(d["reward_amount"]),
                    "type": "daily_checkin",
                    "description": f"Daily Check-in Day {d['day_number']}",
                    "created_at": d["claimed_at"].isoformat() if d["claimed_at"] else None
                })
            
            # Get social task rewards
            await cursor.execute(
                """SELECT ust.id, st.task_name, st.reward_amount, ust.completed_at
                   FROM user_social_tasks ust
                   JOIN social_tasks st ON ust.task_id = st.id
                   WHERE ust.user_id = %s
                   ORDER BY ust.completed_at DESC
                   LIMIT 50""",
                (current_user["id"],)
            )
            social = await cursor.fetchall()
            for s in social:
                transactions.append({
                    "id": f"social_{s['id']}",
                    "amount": float(s["reward_amount"]),
                    "type": "social_task",
                    "description": f"{s['task_name']} Task",
                    "created_at": s["completed_at"].isoformat() if s["completed_at"] else None
                })
            
            # Get referral rewards
            await cursor.execute(
                """SELECT id, reward_amount, reward_type, created_at
                   FROM referral_rewards
                   WHERE referrer_id = %s
                   ORDER BY created_at DESC
                   LIMIT 50""",
                (current_user["id"],)
            )
            referrals = await cursor.fetchall()
            for r in referrals:
                transactions.append({
                    "id": f"ref_{r['id']}",
                    "amount": float(r["reward_amount"]),
                    "type": "referral",
                    "description": f"Referral Bonus - {r['reward_type']}",
                    "created_at": r["created_at"].isoformat() if r["created_at"] else None
                })
    
    # Sort all transactions by date (most recent first)
    transactions.sort(key=lambda x: x["created_at"] or "", reverse=True)
    
    return {
        "total_pnrp": float(current_user["total_pnrp"]),
        "level": current_user["level"],
        "transactions": transactions[:100]  # Limit to 100 most recent
    }


# ==================== LEADERBOARD ROUTES ====================

@api_router.get("/leaderboard")
async def get_leaderboard():
    """Get top users by PNRP"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(
                """SELECT username, full_name, total_pnrp, level 
                   FROM users ORDER BY total_pnrp DESC LIMIT 100"""
            )
            users = await cursor.fetchall()
    
    leaderboard = []
    for idx, user in enumerate(users, 1):
        leaderboard.append({
            "rank": idx,
            "username": user["username"],
            "name": user["full_name"],
            "total_pnrp": float(user["total_pnrp"]),
            "level": user["level"]
        })
    
    return leaderboard


# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    """Admin: Get platform statistics"""
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            # Total users
            await cursor.execute("SELECT COUNT(*) as count FROM users")
            total_users = (await cursor.fetchone())['count']
            
            # Total PNRP distributed
            await cursor.execute("SELECT SUM(total_pnrp) as total FROM users")
            total_pnrp = (await cursor.fetchone())['total'] or 0
            
            # Active mining sessions
            await cursor.execute(
                """SELECT COUNT(*) as count FROM mining_sessions 
                   WHERE status = 'active'"""
            )
            active_mining = (await cursor.fetchone())['count']
            
            # Total transactions (all ad interactions + social tasks + referrals)
            await cursor.execute("SELECT COUNT(*) as count FROM ad_interactions")
            total_transactions = (await cursor.fetchone())['count']
    
    return {
        "total_users": total_users,
        "total_pnrp_distributed": float(total_pnrp),
        "active_mining_sessions": active_mining,
        "total_transactions": total_transactions
    }


@api_router.get("/admin/users")
async def get_all_users_admin(current_user: dict = Depends(get_current_user)):
    """Admin: Get all users"""
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(
                """SELECT id, username, full_name, email, total_pnrp, level, created_at 
                   FROM users ORDER BY created_at DESC"""
            )
            users = await cursor.fetchall()
    
    users_list = []
    for user in users:
        users_list.append({
            "id": user["id"],
            "username": user["username"],
            "name": user["full_name"],
            "email": user["email"],
            "total_pnrp": float(user["total_pnrp"]),
            "level": user["level"],
            "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"]
        })
    
    return {"users": users_list}


# ==================== CORS ====================

origins = os.environ.get('CORS_ORIGINS', '*').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api_router)


# ==================== ROOT ====================

@app.get("/")
async def root():
    return {"message": "Platinum Network API - MySQL Version", "status": "active"}


@app.get("/health")
async def health():
    return {"status": "healthy", "database": "mysql"}
