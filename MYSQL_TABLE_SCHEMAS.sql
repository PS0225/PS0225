-- =====================================================
-- PLATINUM NETWORK - MySQL Database Schemas
-- Run these in your Namecheap phpMyAdmin (SQL tab)
-- =====================================================

-- 1. USERS TABLE (Already created by you ✓)
-- id, username, full_name, email, hashed_password, referral_code, 
-- referred_by, total_pnrp, level, is_admin, created_at

-- =====================================================
-- 2. MINING SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS mining_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    base_reward DECIMAL(10,2) DEFAULT 50.00,
    status VARCHAR(20) DEFAULT 'active',
    time_boost_ads_watched INT DEFAULT 0,
    speed_boost_ads_watched INT DEFAULT 0,
    speed_multiplier DECIMAL(3,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. DAILY REWARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_rewards (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    reward_date DATE NOT NULL,
    day_number INT NOT NULL,
    reward_amount DECIMAL(10,2) NOT NULL,
    ad_watched BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- If you have an old install with the unique_user_date constraint, drop it:
-- ALTER TABLE daily_rewards DROP INDEX unique_user_date;

-- =====================================================
-- 4. SOCIAL TASKS TABLE (Platform Tasks)
-- =====================================================
CREATE TABLE IF NOT EXISTS social_tasks (
    id VARCHAR(50) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    task_name VARCHAR(100) NOT NULL,
    reward_amount DECIMAL(10,2) DEFAULT 30.00,
    task_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default social tasks
INSERT INTO social_tasks (id, platform, task_name, reward_amount, task_url) VALUES
('task_telegram', 'Telegram', 'Join Telegram Channel', 30.00, 'https://t.me/platinumnetwork'),
('task_twitter', 'Twitter', 'Follow on Twitter', 30.00, 'https://twitter.com/platinumnetwork'),
('task_youtube', 'YouTube', 'Subscribe YouTube', 30.00, 'https://youtube.com/@platinumnetwork'),
('task_instagram', 'Instagram', 'Follow on Instagram', 30.00, 'https://instagram.com/platinumnetwork'),
('task_discord', 'Discord', 'Join Discord Server', 30.00, 'https://discord.gg/platinumnetwork');

-- =====================================================
-- 5. USER SOCIAL TASKS TABLE (User Completion Status)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_social_tasks (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    task_id VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES social_tasks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_task (user_id, task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6. AD INTERACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ad_interactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    ad_type VARCHAR(50) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    reward_pnrp DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 7. REFERRAL REWARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_rewards (
    id VARCHAR(50) PRIMARY KEY,
    referrer_id VARCHAR(50) NOT NULL,
    referred_user_id VARCHAR(50) NOT NULL,
    reward_amount DECIMAL(10,2) DEFAULT 0.00,
    reward_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_mining_user ON mining_sessions(user_id);
CREATE INDEX idx_mining_status ON mining_sessions(status);
CREATE INDEX idx_daily_user_date ON daily_rewards(user_id, reward_date);
CREATE INDEX idx_ad_user ON ad_interactions(user_id);
CREATE INDEX idx_referral_referrer ON referral_rewards(referrer_id);

-- =====================================================
-- DONE! All tables created successfully
-- =====================================================
