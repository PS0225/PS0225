<?php
// Daily Reward APIs - 3 ads per day (15, 25, 40 PNRP)

class DailyRewardAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    private function rewardForAd($n) {
        $rewards = [1 => 15, 2 => 25, 3 => 40];
        return $rewards[$n] ?? 0;
    }

    public function status() {
        $user = JWT::requireUser();
        $today = gmdate('Y-m-d');
        $row = $this->db->fetchOne(
            "SELECT COUNT(*) AS cnt FROM daily_rewards WHERE user_id = ? AND DATE(claimed_at) = ?",
            [$user['id'], $today]
        );
        $adsToday = intval($row['cnt']);
        if ($adsToday >= 3) {
            Response::success(['current_streak' => $adsToday, 'can_claim' => false,
                'next_reward' => 0, 'ads_claimed_today' => $adsToday, 'total_ads_per_day' => 3]);
        }
        Response::success(['current_streak' => $adsToday, 'can_claim' => true,
            'next_reward' => $this->rewardForAd($adsToday + 1),
            'ads_claimed_today' => $adsToday, 'total_ads_per_day' => 3]);
    }

    public function watchAd() {
        $user = JWT::requireUser();
        $today = gmdate('Y-m-d');
        $row = $this->db->fetchOne(
            "SELECT COUNT(*) AS cnt FROM daily_rewards WHERE user_id = ? AND DATE(claimed_at) = ?",
            [$user['id'], $today]
        );
        $adsToday = intval($row['cnt']);
        if ($adsToday >= 3) Response::error('All 3 daily ads already watched today', 400);

        $currentAd = $adsToday + 1;
        $reward = $this->rewardForAd($currentAd);
        $now = DTime::nowMysql();

        $this->db->execute(
            "INSERT INTO daily_rewards (id, user_id, reward_date, day_number, reward_amount, ad_watched, claimed_at)
             VALUES (?, ?, ?, ?, ?, 1, ?)",
            [UUID::v4(), $user['id'], $today, $currentAd, $reward, $now]
        );
        $this->db->execute("UPDATE users SET total_pnrp = total_pnrp + ? WHERE id = ?",
            [$reward, $user['id']]);
        $this->db->execute(
            "INSERT INTO ad_interactions (id, user_id, ad_type, interaction_type, reward_pnrp, created_at)
             VALUES (?, ?, ?, 'watched', ?, ?)",
            [UUID::v4(), $user['id'], "daily_reward_ad{$currentAd}", $reward, $now]
        );
        Response::success([
            'message' => "Ad {$currentAd}/3 reward claimed successfully!",
            'day_number' => $currentAd, 'reward' => $reward,
            'new_balance' => floatval($user['total_pnrp']) + $reward
        ]);
    }
}
