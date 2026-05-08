<?php
// =====================================================
// Platinum Network - PHP Backend Configuration
// EDIT THIS FILE with your cPanel MySQL credentials
// =====================================================

// ---- MySQL Database Settings ----
// Get these from your cPanel -> MySQL Databases section
define('DB_HOST', 'localhost');                  // Usually 'localhost' on cPanel
define('DB_PORT', 3306);
define('DB_NAME', 'your_db_name');               // e.g. cpaneluser_platinum
define('DB_USER', 'your_db_user');               // e.g. cpaneluser_admin
define('DB_PASS', 'your_db_password');
define('DB_CHARSET', 'utf8mb4');

// ---- JWT / Auth Settings ----
// CHANGE THIS to a long random string before going live!
define('JWT_SECRET_KEY', 'platinum-network-secret-key-change-this-2025');
define('JWT_ALGO', 'HS256');
define('JWT_EXPIRY_SECONDS', 60 * 60 * 24 * 7);  // 7 days

// ---- Mining Constants ----
define('BASE_MINING_HOURS', 12);
define('BOOSTED_MINING_HOURS', 24);
define('BASE_MINING_REWARD', 50.0);
define('REFERRAL_COMMISSION_RATE', 0.10);

// ---- CORS Origins ----
// Comma separated list, or "*" to allow all
define('CORS_ORIGINS', '*');

// ---- Error Reporting ----
// Set to false in production
define('DEBUG_MODE', false);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Set default timezone (UTC to match Python backend)
date_default_timezone_set('UTC');
