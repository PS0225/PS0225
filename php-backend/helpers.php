<?php
// =====================================================
// Helpers: JWT, Password, UUID, Response, ReferralCode
// =====================================================

class Response {
    public static function success($data = [], $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public static function error($message, $status = 400) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode(['detail' => $message]);
        exit;
    }

    public static function raw($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}

class UUID {
    public static function v4() {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

class ReferralCode {
    public static function generate($length = 8) {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $code = '';
        $max = strlen($chars) - 1;
        for ($i = 0; $i < $length; $i++) {
            $code .= $chars[random_int(0, $max)];
        }
        return $code;
    }
}

class Password {
    public static function hash($plain) {
        return password_hash($plain, PASSWORD_BCRYPT);
    }

    public static function verify($plain, $hashed) {
        if (empty($hashed)) return false;
        if (strpos($hashed, '$2b$') === 0) {
            $hashed = '$2y$' . substr($hashed, 4);
        } elseif (strpos($hashed, '$2a$') === 0) {
            $hashed = '$2y$' . substr($hashed, 4);
        }
        return password_verify($plain, $hashed);
    }
}

class JWT {
    public static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    public static function base64UrlDecode($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) $data .= str_repeat('=', 4 - $remainder);
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function encode($payload, $secret = null) {
        if ($secret === null) $secret = JWT_SECRET_KEY;
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        if (!isset($payload['exp'])) {
            $payload['exp'] = time() + JWT_EXPIRY_SECONDS;
        }
        $headerEncoded  = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secret, true);
        return "$headerEncoded.$payloadEncoded." . self::base64UrlEncode($signature);
    }

    public static function decode($token, $secret = null) {
        if ($secret === null) $secret = JWT_SECRET_KEY;
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        $signature = self::base64UrlDecode($signatureEncoded);
        $expected  = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secret, true);
        if (!hash_equals($expected, $signature)) return null;
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        if (!$payload) return null;
        if (isset($payload['exp']) && $payload['exp'] < time()) return null;
        return $payload;
    }

    public static function getBearerToken() {
        $headers = null;
        if (function_exists('apache_request_headers')) {
            $apacheHeaders = apache_request_headers();
            foreach ($apacheHeaders as $k => $v) {
                if (strtolower($k) === 'authorization') { $headers = $v; break; }
            }
        }
        if (!$headers && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = $_SERVER['HTTP_AUTHORIZATION'];
        }
        if (!$headers && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        if (!$headers) return null;
        if (preg_match('/Bearer\s+(.+)/i', $headers, $matches)) return trim($matches[1]);
        return null;
    }

    public static function getUserFromToken() {
        $token = self::getBearerToken();
        if (!$token) return null;
        $payload = self::decode($token);
        if (!$payload || empty($payload['sub'])) return null;
        $db = Database::getInstance();
        return $db->fetchOne("SELECT * FROM users WHERE id = ?", [$payload['sub']]);
    }

    public static function requireUser() {
        $user = self::getUserFromToken();
        if (!$user) Response::error('Could not validate credentials', 401);
        return $user;
    }

    public static function requireAdmin() {
        $user = self::requireUser();
        if (empty($user['is_admin'])) Response::error('Admin access required', 403);
        return $user;
    }
}

class DTime {
    public static function nowMysql() { return gmdate('Y-m-d H:i:s'); }
    public static function toIso($mysqlDt) {
        if (!$mysqlDt) return null;
        $ts = strtotime($mysqlDt . ' UTC');
        if ($ts === false) return $mysqlDt;
        return gmdate('Y-m-d\TH:i:s+00:00', $ts);
    }
}
