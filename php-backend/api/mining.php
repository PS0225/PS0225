<?php
// Mining APIs

class MiningAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function status() {
        $user = JWT::requireUser();
        $session = $this->db->fetchOne(
            "SELECT * FROM mining_sessions WHERE user_id = ? AND status IN ('active', 'completed')
             ORDER BY start_time DESC LIMIT 1", [$user['id']]
        );
        if (!$session) Response::success(['has_active_session' => false, 'session' => null]);

        $startTs = strtotime($session['start_time'] . ' UTC');
        if ($session['end_time']) {
            $endTs = strtotime($session['end_time'] . ' UTC');
        } else {
            $hours = ($session['time_boost_ads_watched'] >= 2) ? 24 : 12;
            $endTs = $startTs + ($hours * 3600);
        }
        $now = time();
        $isCompleted = ($now >= $endTs);
        if ($isCompleted && $session['status'] === 'active') {
            $this->db->execute("UPDATE mining_sessions SET status = 'completed' WHERE id = ?", [$session['id']]);
            $session['status'] = 'completed';
        }
        Response::success([
            'has_active_session' => true,
            'session' => [
                'id' => $session['id'], 'user_id' => $session['user_id'],
                'start_time' => gmdate('Y-m-d\TH:i:s+00:00', $startTs),
                'end_time'   => gmdate('Y-m-d\TH:i:s+00:00', $endTs),
                'base_reward' => floatval($session['base_reward']),
                'status' => $session['status'],
                'time_boost_ads_watched' => intval($session['time_boost_ads_watched']),
                'speed_boost_ads_watched' => intval($session['speed_boost_ads_watched']),
                'speed_multiplier' => floatval($session['speed_multiplier']),
                'is_completed' => $isCompleted,
                'time_remaining_seconds' => max(0, $endTs - $now)
            ]
        ]);
    }

    public function start() {
        $user = JWT::requireUser();
        $existing = $this->db->fetchOne(
            "SELECT id FROM mining_sessions WHERE user_id = ? AND status IN ('active', 'completed')",
            [$user['id']]
        );
        if ($existing) Response::error('You already have an active mining session. Please claim it first.', 400);

        $session_id = UUID::v4();
        $start = DTime::nowMysql();
        $startTs = strtotime($start . ' UTC');

        $this->db->execute(
            "INSERT INTO mining_sessions (id, user_id, start_time, base_reward, status,
              time_boost_ads_watched, speed_boost_ads_watched, speed_multiplier, created_at)
             VALUES (?, ?, ?, 50.00, 'active', 0, 0, 1.00, ?)",
            [$session_id, $user['id'], $start, $start]
        );
        Response::success([
            'message' => 'Mining started successfully',
            'session' => [
                'id' => $session_id, 'user_id' => $user['id'],
                'start_time' => gmdate('Y-m-d\TH:i:s+00:00', $startTs),
                'duration_hours' => 12, 'base_reward' => 50.0, 'speed_multiplier' => 1.0,
                'total_reward' => 50.0, 'status' => 'active',
                'time_boost_ads_watched' => 0, 'speed_boost_ads_watched' => 0,
                'end_time' => gmdate('Y-m-d\TH:i:s+00:00', $startTs + 12 * 3600),
            ]
        ]);
    }

    public function claim() {
        $user = JWT::requireUser();
        $session = $this->db->fetchOne(
            "SELECT * FROM mining_sessions WHERE user_id = ? AND status = 'completed'
             ORDER BY start_time DESC LIMIT 1", [$user['id']]
        );
        if (!$session) Response::error('No completed mining session to claim', 400);

        $timeBoostMul = ($session['time_boost_ads_watched'] >= 2) ? 2.0 : 1.0;
        $reward = floatval($session['base_reward']) * $timeBoostMul * floatval($session['speed_multiplier']);

        $this->db->execute("UPDATE users SET total_pnrp = total_pnrp + ? WHERE id = ?", [$reward, $user['id']]);
        $this->db->execute("UPDATE mining_sessions SET status = 'claimed', end_time = ? WHERE id = ?",
            [DTime::nowMysql(), $session['id']]);

        if (!empty($user['referred_by'])) {
            $bonus = $reward * REFERRAL_COMMISSION_RATE;
            $this->db->execute("UPDATE users SET total_pnrp = total_pnrp + ? WHERE id = ?",
                [$bonus, $user['referred_by']]);
            $this->db->execute(
                "INSERT INTO referral_rewards (id, referrer_id, referred_user_id, reward_amount, reward_type, created_at)
                 VALUES (?, ?, ?, ?, 'mining', ?)",
                [UUID::v4(), $user['referred_by'], $user['id'], $bonus, DTime::nowMysql()]
            );
        }
        Response::success([
            'message' => 'Mining rewards claimed successfully',
            'reward' => $reward, 'new_balance' => floatval($user['total_pnrp']) + $reward
        ]);
    }

    public function watchAd() {
        $user = JWT::requireUser();
        $adType = Request::getQuery('ad_type');
        if (!$adType) { $body = Request::getBody(); $adType = $body['ad_type'] ?? null; }
        if (!in_array($adType, ['time_boost', 'speed_boost'], true)) Response::error('Invalid ad type', 400);

        $session = $this->db->fetchOne(
            "SELECT * FROM mining_sessions WHERE user_id = ? AND status = 'active'
             ORDER BY start_time DESC LIMIT 1", [$user['id']]
        );
        if (!$session) Response::error('No active mining session', 400);

        if ($adType === 'time_boost') {
            if ($session['time_boost_ads_watched'] >= 2) Response::error('Maximum time boost ads already watched', 400);
            $newCount = $session['time_boost_ads_watched'] + 1;
            $this->db->execute("UPDATE mining_sessions SET time_boost_ads_watched = ? WHERE id = ?",
                [$newCount, $session['id']]);
            $message = "Ad watched ({$newCount}/2 for time boost)";
            if ($newCount == 2) $message = 'Time boost activated! Mining duration extended to 24 hours';
        } else {
            if ($session['speed_boost_ads_watched'] >= 5) Response::error('Maximum speed boost ads already watched', 400);
            $newCount = $session['speed_boost_ads_watched'] + 1;
            $this->db->execute("UPDATE mining_sessions SET speed_boost_ads_watched = ? WHERE id = ?",
                [$newCount, $session['id']]);
            if ($newCount == 5) {
                $this->db->execute("UPDATE mining_sessions SET speed_multiplier = 2.00 WHERE id = ?",
                    [$session['id']]);
            }
            $message = "Ad watched ({$newCount}/5 for speed boost)";
            if ($newCount == 5) $message = 'Speed boost activated! Mining speed is now 2x';
        }

        $this->db->execute(
            "INSERT INTO ad_interactions (id, user_id, ad_type, interaction_type, reward_pnrp, created_at)
             VALUES (?, ?, ?, 'watched', 0, ?)",
            [UUID::v4(), $user['id'], $adType, DTime::nowMysql()]
        );
        Response::success(['message' => $message, 'ads_watched' => $newCount]);
    }
}
