<?php
// =====================================================
// Request helpers - parse JSON body, query params
// =====================================================

class Request {
    private static $body = null;

    public static function getBody() {
        if (self::$body !== null) return self::$body;
        $raw = file_get_contents('php://input');
        if (!$raw) {
            self::$body = $_POST ?: [];
            return self::$body;
        }
        $json = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            self::$body = $json;
        } else {
            self::$body = $_POST ?: [];
        }
        return self::$body;
    }

    public static function getQuery($key, $default = null) {
        return $_GET[$key] ?? $default;
    }

    public static function method() { return $_SERVER['REQUEST_METHOD'] ?? 'GET'; }

    public static function path() {
        if (isset($_GET['__path'])) return $_GET['__path'];
        if (isset($_SERVER['PATH_INFO'])) return $_SERVER['PATH_INFO'];
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $qpos = strpos($uri, '?');
        if ($qpos !== false) $uri = substr($uri, 0, $qpos);
        return $uri;
    }
}
