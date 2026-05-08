<?php
// =====================================================
// Platinum Network - Main Router
// All /api/* requests land here via .htaccess
// =====================================================

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/request.php';

require_once __DIR__ . '/api/auth.php';
require_once __DIR__ . '/api/mining.php';
require_once __DIR__ . '/api/daily_rewards.php';
require_once __DIR__ . '/api/wallet.php';
require_once __DIR__ . '/api/referrals.php';
require_once __DIR__ . '/api/leaderboard.php';
require_once __DIR__ . '/api/social_tasks.php';
require_once __DIR__ . '/api/admin.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_map('trim', explode(',', CORS_ORIGINS));
if (CORS_ORIGINS === '*') {
    header('Access-Control-Allow-Origin: *');
} elseif ($origin && in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (Request::method() === 'OPTIONS') { http_response_code(204); exit; }

$method = Request::method();
$path   = Request::path();

$prefix = '/api';
$pos = strpos($path, $prefix);
if ($pos !== false) $path = substr($path, $pos + strlen($prefix));
$path = '/' . trim($path, '/');

if ($path === '/' || $path === '') {
    Response::success(['message' => 'Platinum Network API - PHP Version', 'status' => 'active']);
}
if ($path === '/health') {
    Response::success(['status' => 'healthy', 'database' => 'mysql']);
}

$routes = [
    ['POST', '/auth/register',          fn() => (new AuthAPI())->register()],
    ['POST', '/auth/login',             fn() => (new AuthAPI())->login()],
    ['GET',  '/auth/me',                fn() => (new AuthAPI())->me()],
    ['GET',  '/mining/status',          fn() => (new MiningAPI())->status()],
    ['POST', '/mining/start',           fn() => (new MiningAPI())->start()],
    ['POST', '/mining/claim',           fn() => (new MiningAPI())->claim()],
    ['POST', '/mining/watch-ad',        fn() => (new MiningAPI())->watchAd()],
    ['GET',  '/daily-reward/status',    fn() => (new DailyRewardAPI())->status()],
    ['POST', '/daily-reward/watch-ad',  fn() => (new DailyRewardAPI())->watchAd()],
    ['GET',  '/wallet',                 fn() => (new WalletAPI())->get()],
    ['GET',  '/referrals',              fn() => (new ReferralsAPI())->get()],
    ['GET',  '/leaderboard',            fn() => (new LeaderboardAPI())->get()],
    ['GET',  '/social-tasks',           fn() => (new SocialTasksAPI())->getTasks()],
    ['GET',  '/admin/stats',            fn() => (new AdminAPI())->stats()],
    ['GET',  '/admin/users',            fn() => (new AdminAPI())->users()],
];

foreach ($routes as $route) {
    [$m, $p, $handler] = $route;
    if ($method === $m && $path === $p) { $handler(); exit; }
}

if ($method === 'POST' && preg_match('#^/social-tasks/([^/]+)/complete$#', $path, $matches)) {
    (new SocialTasksAPI())->complete($matches[1]);
    exit;
}

Response::error("Endpoint not found: $method $path", 404);
