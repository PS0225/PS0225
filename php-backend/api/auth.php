<?php
// Authentication APIs (matches FastAPI server.py)

class AuthAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function register() {
        $data = Request::getBody();
        $required = ['username', 'name', 'email', 'password', 'confirm_password'];
        foreach ($required as $f) {
            if (!isset($data[$f]) || $data[$f] === '') Response::error("$f is required", 400);
        }
        if ($data['password'] !== $data['confirm_password']) Response::error('Passwords do not match', 400);
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) Response::error('Invalid email format', 400);

        if ($this->db->fetchOne("SELECT id FROM users WHERE username = ?", [$data['username']])) {
            Response::error('Username already exists', 400);
        }
        if ($this->db->fetchOne("SELECT id FROM users WHERE email = ?", [$data['email']])) {
            Response::error('Email already exists', 400);
        }

        $referrer_id = null;
        if (!empty($data['referral_code'])) {
            $referrer = $this->db->fetchOne(
                "SELECT id FROM users WHERE referral_code = ?",
                [$data['referral_code']]
            );
            if (!$referrer) Response::error('Invalid referral code', 400);
            $referrer_id = $referrer['id'];
        }

        do {
            $referral_code = ReferralCode::generate();
            $exists = $this->db->fetchOne("SELECT id FROM users WHERE referral_code = ?", [$referral_code]);
        } while ($exists);

        $user_id = UUID::v4();
        $hashed  = Password::hash($data['password']);
        $created = DTime::nowMysql();

        try {
            $this->db->execute(
                "INSERT INTO users (id, username, full_name, email, hashed_password,
                    referral_code, referred_by, total_pnrp, level, is_admin, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1, 0, ?)",
                [$user_id, $data['username'], $data['name'], $data['email'], $hashed,
                 $referral_code, $referrer_id, $created]
            );
        } catch (Exception $e) {
            Response::error('Registration failed: ' . (DEBUG_MODE ? $e->getMessage() : 'database error'), 500);
        }

        $token = JWT::encode(['sub' => $user_id]);
        Response::success([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user_id, 'username' => $data['username'], 'name' => $data['name'],
                'email' => $data['email'], 'referral_code' => $referral_code, 'total_pnrp' => 0.0
            ]
        ]);
    }

    public function login() {
        $data = Request::getBody();
        if (empty($data['email']) || empty($data['password'])) Response::error('Email and password are required', 400);

        $user = $this->db->fetchOne("SELECT * FROM users WHERE email = ?", [$data['email']]);
        if (!$user || !Password::verify($data['password'], $user['hashed_password'])) {
            Response::error('Invalid email or password', 401);
        }

        $token = JWT::encode(['sub' => $user['id']]);
        Response::success([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user['id'], 'username' => $user['username'], 'name' => $user['full_name'],
                'email' => $user['email'], 'referral_code' => $user['referral_code'],
                'total_pnrp' => floatval($user['total_pnrp']), 'is_admin' => (bool)$user['is_admin']
            ]
        ]);
    }

    public function me() {
        $user = JWT::requireUser();
        Response::success([
            'id' => $user['id'], 'username' => $user['username'], 'name' => $user['full_name'],
            'email' => $user['email'], 'referral_code' => $user['referral_code'],
            'total_pnrp' => floatval($user['total_pnrp']), 'level' => intval($user['level']),
            'is_admin' => (bool)$user['is_admin'], 'created_at' => DTime::toIso($user['created_at'])
        ]);
    }
}
