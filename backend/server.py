from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
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
    name: str
    email: EmailStr
    password: str  # hashed
    referral_code: str = Field(default_factory=lambda: generate_referral_code())
    referred_by: Optional[str] = None  # referrer's user_id
    total_pnrp: float = 0.0
    level: int = 1
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MiningSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    start_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    duration_hours: int = 12  # 12 or 24
    base_reward: float = 50.0
    speed_multiplier: float = 1.0  # 1x or 2x
    total_reward: float = 50.0
    status: str = "active"  # active, completed, claimed
    time_boost_ads_watched: int = 0  # 0-2
    speed_boost_ads_watched: int = 0  # 0-2
    end_time: Optional[datetime] = None
    claimed_at: Optional[datetime] = None


class DailyCheckin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    day_number: int  # 1-7
    reward: float
    ad_watched: bool = False
    claimed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SocialTask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    platform: str
    reward: float = 30.0
    icon: str
    url: str
    description: str


class UserSocialTask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    social_task_id: str
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # mining, referral, daily_checkin, social_task, admin_bonus
    amount: float
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReferralEarning(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    referrer_id: str
    referred_id: str
    amount: float
    date: str  # YYYY-MM-DD
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdWatch(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ad_type: str  # daily_checkin, mining_time_boost, daily_reward_1, daily_reward_2, daily_reward_3
    watched_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DailyReward(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ad_number: int  # 1, 2, or 3
    reward: float  # 10, 15, or 25
    claimed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    date: str  # YYYY-MM-DD


# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    """Register a new user"""
    # Validate passwords match
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Check if username exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check if email exists
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Validate referral code if provided
    referrer_id = None
    if user_data.referral_code:
        referrer = await db.users.find_one({"referral_code": user_data.referral_code})
        if not referrer:
            raise HTTPException(status_code=400, detail="Invalid referral code")
        referrer_id = referrer["id"]
    
    # Create user
    user = User(
        username=user_data.username,
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        referred_by=referrer_id
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "referral_code": user.referral_code,
            "total_pnrp": user.total_pnrp
        }
    }


@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    """Login user"""
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(login_data.password, user["password"]):
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
            "name": user["name"],
            "email": user["email"],
            "referral_code": user["referral_code"],
            "total_pnrp": user["total_pnrp"],
            "is_admin": user.get("is_admin", False)
        }
    }


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "name": current_user["name"],
        "email": current_user["email"],
        "referral_code": current_user["referral_code"],
        "total_pnrp": current_user["total_pnrp"],
        "level": current_user["level"],
        "is_admin": current_user.get("is_admin", False),
        "created_at": current_user["created_at"]
    }


# ==================== MINING ROUTES ====================

@api_router.get("/mining/status")
async def get_mining_status(current_user: dict = Depends(get_current_user)):
    """Get current mining session status"""
    session = await db.mining_sessions.find_one(
        {"user_id": current_user["id"], "status": {"$in": ["active", "completed"]}},
        {"_id": 0},
        sort=[("start_time", -1)]  # Get latest session
    )
    
    if not session:
        return {"has_active_session": False, "session": None}
    
    # Convert ISO strings to datetime
    if isinstance(session.get('start_time'), str):
        session['start_time'] = datetime.fromisoformat(session['start_time'])
    if isinstance(session.get('end_time'), str):
        session['end_time'] = datetime.fromisoformat(session['end_time'])
    
    # Calculate end time
    if session['end_time']:
        end_time = session['end_time']
    else:
        end_time = session['start_time'] + timedelta(hours=session['duration_hours'])
    
    # Check if completed
    now = datetime.now(timezone.utc)
    is_completed = now >= end_time
    
    if is_completed and session['status'] == 'active':
        await db.mining_sessions.update_one(
            {"id": session["id"]},
            {"$set": {"status": "completed"}}
        )
        session['status'] = 'completed'
    
    return {
        "has_active_session": True,
        "session": {
            **session,
            "start_time": session['start_time'].isoformat(),
            "end_time": end_time.isoformat(),
            "is_completed": is_completed,
            "time_remaining_seconds": max(0, int((end_time - now).total_seconds()))
        }
    }


@api_router.post("/mining/start")
async def start_mining(current_user: dict = Depends(get_current_user)):
    """Start a new mining session"""
    # Check if user already has an active session
    existing_session = await db.mining_sessions.find_one(
        {"user_id": current_user["id"], "status": {"$in": ["active", "completed"]}},
        {"_id": 0}
    )
    
    if existing_session:
        raise HTTPException(status_code=400, detail="You already have an active mining session. Please claim it first.")
    
    # Create new mining session
    session = MiningSession(user_id=current_user["id"])
    session_dict = session.model_dump()
    session_dict['start_time'] = session_dict['start_time'].isoformat()
    if session_dict.get('end_time'):
        session_dict['end_time'] = session_dict['end_time'].isoformat()
    if session_dict.get('claimed_at'):
        session_dict['claimed_at'] = session_dict['claimed_at'].isoformat()
    
    await db.mining_sessions.insert_one(session_dict)
    
    return {
        "message": "Mining started successfully",
        "session": {
            "id": session_dict["id"],
            "user_id": session_dict["user_id"],
            "start_time": session_dict['start_time'],
            "duration_hours": session_dict["duration_hours"],
            "base_reward": session_dict["base_reward"],
            "speed_multiplier": session_dict["speed_multiplier"],
            "total_reward": session_dict["total_reward"],
            "status": session_dict["status"],
            "time_boost_ads_watched": session_dict["time_boost_ads_watched"],
            "speed_boost_ads_watched": session_dict["speed_boost_ads_watched"],
            "end_time": (session.start_time + timedelta(hours=session.duration_hours)).isoformat()
        }
    }


@api_router.post("/mining/claim")
async def claim_mining(current_user: dict = Depends(get_current_user)):
    """Claim mining rewards"""
    session = await db.mining_sessions.find_one(
        {"user_id": current_user["id"], "status": "completed"},
        {"_id": 0}
    )
    
    if not session:
        raise HTTPException(status_code=400, detail="No completed mining session to claim")
    
    # Convert ISO strings to datetime
    if isinstance(session.get('start_time'), str):
        session['start_time'] = datetime.fromisoformat(session['start_time'])
    
    # Calculate reward
    reward = session['base_reward'] * session['speed_multiplier']
    
    # Update user balance
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"total_pnrp": reward}}
    )
    
    # Mark session as claimed
    await db.mining_sessions.update_one(
        {"id": session["id"]},
        {"$set": {"status": "claimed", "claimed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user["id"],
        type="mining",
        amount=reward,
        description=f"Mining reward ({session['duration_hours']}h, {session['speed_multiplier']}x speed)"
    )
    transaction_dict = transaction.model_dump()
    transaction_dict['created_at'] = transaction_dict['created_at'].isoformat()
    await db.transactions.insert_one(transaction_dict)
    
    # Give referral bonus (10% to referrer)
    if current_user.get("referred_by"):
        referral_bonus = reward * 0.1
        await db.users.update_one(
            {"id": current_user["referred_by"]},
            {"$inc": {"total_pnrp": referral_bonus}}
        )
        
        # Create referral earning record
        referral_earning = ReferralEarning(
            referrer_id=current_user["referred_by"],
            referred_id=current_user["id"],
            amount=referral_bonus,
            date=datetime.now(timezone.utc).strftime("%Y-%m-%d")
        )
        ref_dict = referral_earning.model_dump()
        ref_dict['created_at'] = ref_dict['created_at'].isoformat()
        await db.referral_earnings.insert_one(ref_dict)
        
        # Create transaction for referrer
        ref_transaction = Transaction(
            user_id=current_user["referred_by"],
            type="referral",
            amount=referral_bonus,
            description=f"Referral bonus from {current_user['username']}"
        )
        ref_trans_dict = ref_transaction.model_dump()
        ref_trans_dict['created_at'] = ref_trans_dict['created_at'].isoformat()
        await db.transactions.insert_one(ref_trans_dict)
    
    return {
        "message": "Mining rewards claimed successfully",
        "reward": reward,
        "new_balance": current_user["total_pnrp"] + reward
    }


@api_router.post("/mining/watch-ad")
async def watch_ad(ad_type: str, current_user: dict = Depends(get_current_user)):
    """Watch an ad to boost mining - only time boost available"""
    if ad_type != "time_boost":
        raise HTTPException(status_code=400, detail="Invalid ad type")
    
    # Get active mining session
    session = await db.mining_sessions.find_one(
        {"user_id": current_user["id"], "status": "active"},
        {"_id": 0}
    )
    
    if not session:
        raise HTTPException(status_code=400, detail="No active mining session")
    
    # Check ad limit for time boost
    if session['time_boost_ads_watched'] >= 2:
        raise HTTPException(status_code=400, detail="Maximum time boost ads already watched")
    
    # Increment ad count
    new_count = session['time_boost_ads_watched'] + 1
    await db.mining_sessions.update_one(
        {"id": session["id"]},
        {"$set": {"time_boost_ads_watched": new_count}}
    )
    
    # If 2 ads watched, extend duration to 24 hours
    if new_count == 2:
        await db.mining_sessions.update_one(
            {"id": session["id"]},
            {"$set": {"duration_hours": 24}}
        )
        message = "Time boost activated! Mining duration extended to 24 hours"
    else:
        message = f"Ad watched ({new_count}/2 for time boost)"
    
    # Record ad watch
    ad_watch = AdWatch(
        user_id=current_user["id"],
        ad_type="mining_time_boost"
    )
    ad_dict = ad_watch.model_dump()
    ad_dict['watched_at'] = ad_dict['watched_at'].isoformat()
    await db.ad_watches.insert_one(ad_dict)
    
    return {"message": message}


# ==================== DAILY REWARD ROUTES ====================

@api_router.get("/daily-reward/status")
async def get_daily_reward_status(current_user: dict = Depends(get_current_user)):
    """Get daily reward status (3 ads system)"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Get today's rewards
    rewards_today = await db.daily_rewards.find(
        {
            "user_id": current_user["id"],
            "date": today
        },
        {"_id": 0}
    ).to_list(10)
    
    # Count how many ads watched today
    ads_watched = len(rewards_today)
    
    # Determine next reward
    reward_amounts = {1: 10, 2: 15, 3: 25}
    next_ad_number = ads_watched + 1 if ads_watched < 3 else None
    next_reward = reward_amounts.get(next_ad_number, 0)
    
    return {
        "ads_watched": ads_watched,
        "total_ads": 3,
        "next_ad_number": next_ad_number,
        "next_reward": next_reward,
        "can_claim": next_ad_number is not None,
        "rewards_claimed": rewards_today,
        "total_earned_today": sum(r["reward"] for r in rewards_today)
    }


@api_router.post("/daily-reward/watch-ad")
async def watch_daily_reward_ad(current_user: dict = Depends(get_current_user)):
    """Watch ad for daily reward"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check how many ads already watched today
    rewards_today = await db.daily_rewards.count_documents({
        "user_id": current_user["id"],
        "date": today
    })
    
    if rewards_today >= 3:
        raise HTTPException(status_code=400, detail="All 3 daily reward ads already claimed today")
    
    # Determine which ad number this is
    ad_number = rewards_today + 1
    reward_amounts = {1: 10, 2: 15, 3: 25}
    reward = reward_amounts[ad_number]
    
    # Create reward record
    daily_reward = DailyReward(
        user_id=current_user["id"],
        ad_number=ad_number,
        reward=reward,
        date=today
    )
    reward_dict = daily_reward.model_dump()
    reward_dict['claimed_at'] = reward_dict['claimed_at'].isoformat()
    await db.daily_rewards.insert_one(reward_dict)
    
    # Update user balance
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"total_pnrp": reward}}
    )
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user["id"],
        type="daily_reward",
        amount=reward,
        description=f"Daily reward ad {ad_number}/3"
    )
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    # Record ad watch
    ad_watch = AdWatch(
        user_id=current_user["id"],
        ad_type=f"daily_reward_{ad_number}"
    )
    ad_dict = ad_watch.model_dump()
    ad_dict['watched_at'] = ad_dict['watched_at'].isoformat()
    await db.ad_watches.insert_one(ad_dict)
    
    return {
        "message": f"Daily reward ad {ad_number}/3 claimed successfully!",
        "ad_number": ad_number,
        "reward": reward,
        "new_balance": current_user["total_pnrp"] + reward,
        "remaining_ads": 3 - ad_number
    }


# ==================== DAILY CHECK-IN ROUTES ====================

@api_router.get("/checkin/status")
async def get_checkin_status(current_user: dict = Depends(get_current_user)):
    """Get daily check-in status"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check if already checked in today
    today_checkin = await db.daily_checkins.find_one(
        {
            "user_id": current_user["id"],
            "created_at": {"$regex": f"^{today}"}
        },
        {"_id": 0}
    )
    
    if today_checkin:
        return {
            "checked_in_today": True,
            "checkin": today_checkin
        }
    
    # Get last check-in to determine current day
    last_checkin = await db.daily_checkins.find_one(
        {"user_id": current_user["id"]},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    if not last_checkin:
        current_day = 1
    else:
        # Check if last check-in was yesterday
        if isinstance(last_checkin.get('created_at'), str):
            last_date = datetime.fromisoformat(last_checkin['created_at']).date()
        else:
            last_date = last_checkin['created_at'].date()
        
        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).date()
        
        if last_date == yesterday:
            # Continue streak
            current_day = (last_checkin['day_number'] % 7) + 1
        else:
            # Reset streak
            current_day = 1
    
    # Calculate reward for current day
    rewards = {1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 50}
    reward = rewards[current_day]
    
    return {
        "checked_in_today": False,
        "current_day": current_day,
        "reward": reward
    }


@api_router.post("/checkin/watch-ad")
async def watch_checkin_ad(current_user: dict = Depends(get_current_user)):
    """Watch ad for daily check-in"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check if already checked in today
    today_checkin = await db.daily_checkins.find_one(
        {
            "user_id": current_user["id"],
            "created_at": {"$regex": f"^{today}"}
        }
    )
    
    if today_checkin:
        raise HTTPException(status_code=400, detail="Already checked in today")
    
    # Record ad watch
    ad_watch = AdWatch(
        user_id=current_user["id"],
        ad_type="daily_checkin"
    )
    ad_dict = ad_watch.model_dump()
    ad_dict['watched_at'] = ad_dict['watched_at'].isoformat()
    await db.ad_watches.insert_one(ad_dict)
    
    return {"message": "Ad watched successfully. You can now claim your reward."}


@api_router.post("/checkin/claim")
async def claim_checkin(current_user: dict = Depends(get_current_user)):
    """Claim daily check-in reward"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # Check if already checked in today
    today_checkin = await db.daily_checkins.find_one(
        {
            "user_id": current_user["id"],
            "created_at": {"$regex": f"^{today}"}
        }
    )
    
    if today_checkin:
        raise HTTPException(status_code=400, detail="Already checked in today")
    
    # Check if ad was watched
    ad_watched = await db.ad_watches.find_one(
        {
            "user_id": current_user["id"],
            "ad_type": "daily_checkin",
            "watched_at": {"$regex": f"^{today}"}
        }
    )
    
    if not ad_watched:
        raise HTTPException(status_code=400, detail="Please watch the ad first")
    
    # Get current day
    last_checkin = await db.daily_checkins.find_one(
        {"user_id": current_user["id"]},
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    if not last_checkin:
        current_day = 1
    else:
        if isinstance(last_checkin.get('created_at'), str):
            last_date = datetime.fromisoformat(last_checkin['created_at']).date()
        else:
            last_date = last_checkin['created_at'].date()
        
        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).date()
        
        if last_date == yesterday:
            current_day = (last_checkin['day_number'] % 7) + 1
        else:
            current_day = 1
    
    # Calculate reward
    rewards = {1: 5, 2: 10, 3: 15, 4: 20, 5: 25, 6: 30, 7: 50}
    reward = rewards[current_day]
    
    # Create check-in record
    checkin = DailyCheckin(
        user_id=current_user["id"],
        day_number=current_day,
        reward=reward,
        ad_watched=True,
        claimed_at=datetime.now(timezone.utc)
    )
    checkin_dict = checkin.model_dump()
    checkin_dict['created_at'] = checkin_dict['created_at'].isoformat()
    if checkin_dict['claimed_at']:
        checkin_dict['claimed_at'] = checkin_dict['claimed_at'].isoformat()
    
    await db.daily_checkins.insert_one(checkin_dict)
    
    # Update user balance
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"total_pnrp": reward}}
    )
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user["id"],
        type="daily_checkin",
        amount=reward,
        description=f"Daily check-in Day {current_day}"
    )
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    return {
        "message": "Daily check-in reward claimed successfully",
        "day": current_day,
        "reward": reward,
        "new_balance": current_user["total_pnrp"] + reward
    }


# ==================== SOCIAL TASKS ROUTES ====================

@api_router.get("/social-tasks")
async def get_social_tasks(current_user: dict = Depends(get_current_user)):
    """Get all social tasks with completion status"""
    # Get all social tasks
    tasks = await db.social_tasks.find({}, {"_id": 0}).to_list(100)
    
    # Get user's completed tasks
    completed_tasks = await db.user_social_tasks.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).to_list(100)
    
    completed_task_ids = [task["social_task_id"] for task in completed_tasks]
    
    # Mark tasks as completed
    for task in tasks:
        task["completed"] = task["id"] in completed_task_ids
    
    return tasks


@api_router.post("/social-tasks/{task_id}/complete")
async def complete_social_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Complete a social task"""
    # Check if task exists
    task = await db.social_tasks.find_one({"id": task_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Social task not found")
    
    # Check if already completed
    existing = await db.user_social_tasks.find_one({
        "user_id": current_user["id"],
        "social_task_id": task_id
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Task already completed")
    
    # Create completion record
    user_task = UserSocialTask(
        user_id=current_user["id"],
        social_task_id=task_id
    )
    user_task_dict = user_task.model_dump()
    user_task_dict['completed_at'] = user_task_dict['completed_at'].isoformat()
    await db.user_social_tasks.insert_one(user_task_dict)
    
    # Update user balance
    reward = task["reward"]
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"total_pnrp": reward}}
    )
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user["id"],
        type="social_task",
        amount=reward,
        description=f"Social task completed: {task['name']}"
    )
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    return {
        "message": "Social task completed successfully",
        "reward": reward,
        "new_balance": current_user["total_pnrp"] + reward
    }


# ==================== REFERRAL ROUTES ====================

@api_router.get("/referrals")
async def get_referrals(current_user: dict = Depends(get_current_user)):
    """Get user's referrals and earnings"""
    # Get referred users
    referrals = await db.users.find(
        {"referred_by": current_user["id"]},
        {"_id": 0, "id": 1, "username": 1, "name": 1, "total_pnrp": 1, "created_at": 1}
    ).to_list(1000)
    
    # Get referral earnings
    earnings = await db.referral_earnings.find(
        {"referrer_id": current_user["id"]},
        {"_id": 0}
    ).to_list(1000)
    
    total_earnings = sum(earning["amount"] for earning in earnings)
    
    return {
        "referral_code": current_user["referral_code"],
        "total_referrals": len(referrals),
        "total_earnings": total_earnings,
        "referrals": referrals,
        "earnings": earnings
    }


# ==================== WALLET ROUTES ====================

@api_router.get("/wallet")
async def get_wallet(current_user: dict = Depends(get_current_user)):
    """Get wallet balance and transactions"""
    # Get transactions
    transactions = await db.transactions.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {
        "total_pnrp": current_user["total_pnrp"],
        "transactions": transactions
    }


# ==================== LEADERBOARD ROUTES ====================

@api_router.get("/leaderboard")
async def get_leaderboard(limit: int = 100):
    """Get top users leaderboard"""
    users = await db.users.find(
        {},
        {"_id": 0, "id": 1, "username": 1, "name": 1, "total_pnrp": 1, "level": 1}
    ).sort("total_pnrp", -1).limit(limit).to_list(limit)
    
    return users


# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    """Get admin statistics"""
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = await db.users.count_documents({})
    total_pnrp_distributed = await db.users.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$total_pnrp"}}}
    ]).to_list(1)
    
    active_mining = await db.mining_sessions.count_documents({"status": "active"})
    total_transactions = await db.transactions.count_documents({})
    
    return {
        "total_users": total_users,
        "total_pnrp_distributed": total_pnrp_distributed[0]["total"] if total_pnrp_distributed else 0,
        "active_mining_sessions": active_mining,
        "total_transactions": total_transactions
    }


# ==================== INITIALIZATION ====================

@app.on_event("startup")
async def startup_event():
    """Initialize database with default data"""
    # Create admin user if not exists
    admin = await db.users.find_one({"email": "admin@platinumnetwork.com"})
    if not admin:
        admin_user = User(
            username="admin",
            name="Admin",
            email="admin@platinumnetwork.com",
            password=hash_password("Admin@12345"),
            is_admin=True,
            total_pnrp=0
        )
        admin_dict = admin_user.model_dump()
        admin_dict['created_at'] = admin_dict['created_at'].isoformat()
        await db.users.insert_one(admin_dict)
        logger.info("Admin user created")
    
    # Create social tasks if not exist
    tasks_count = await db.social_tasks.count_documents({})
    if tasks_count == 0:
        social_tasks = [
            {
                "id": str(uuid.uuid4()),
                "name": "Join Facebook",
                "platform": "facebook",
                "reward": 30.0,
                "icon": "facebook",
                "url": "https://facebook.com/platinumnetwork",
                "description": "Follow us on Facebook"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Join Twitter",
                "platform": "twitter",
                "reward": 30.0,
                "icon": "twitter",
                "url": "https://twitter.com/platinumnetwork",
                "description": "Follow us on Twitter"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Join Instagram",
                "platform": "instagram",
                "reward": 30.0,
                "icon": "instagram",
                "url": "https://instagram.com/platinumnetwork",
                "description": "Follow us on Instagram"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Join Telegram",
                "platform": "telegram",
                "reward": 30.0,
                "icon": "send",
                "url": "https://t.me/platinumnetwork",
                "description": "Join our Telegram channel"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Subscribe YouTube",
                "platform": "youtube",
                "reward": 30.0,
                "icon": "youtube",
                "url": "https://youtube.com/@platinumnetwork",
                "description": "Subscribe to our YouTube channel"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Join WhatsApp",
                "platform": "whatsapp",
                "reward": 30.0,
                "icon": "message-circle",
                "url": "https://whatsapp.com/platinumnetwork",
                "description": "Join our WhatsApp community"
            }
        ]
        await db.social_tasks.insert_many(social_tasks)
        logger.info("Social tasks created")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
