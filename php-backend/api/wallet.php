<?php
// Wallet API - returns balance + transactions list

class WalletAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function get() {
        $user = JWT::requireUser();
        $transactions = [];

        $mining = $this->db->fetchAll(
            "SELECT id, base_reward, speed_multiplier, created_at FROM mining_sessions
             WHERE user_id = ? AND status = 'completed' ORDER BY created_at DESC LIMIT 50",
            [$user['id']]
        );
        foreach ($mining as $m) {
            $reward = floatval($m['base_reward']) * floatval($m['speed_multiplier']);
            $transactions[] = ['id' => 'mine_' . $m['id'], 'amount' => $reward, 'type' => 'mining',
                'description' => "Mining Reward ({$reward} PNRP)",
                'created_at' => DTime::toIso($m['created_at'])];
        }

        $daily = $this->db->fetchAll(
            "SELECT id, reward_amount, day_number, claimed_at FROM daily_rewards
             WHERE user_id = ? ORDER BY claimed_at DESC LIMIT 50", [$user['id']]
        );
        foreach ($daily as $d) {
            $transactions[] = ['id' => 'daily_' . $d['id'], 'amount' => floatval($d['reward_amount']),
                'type' => 'daily_checkin', 'description' => "Daily Check-in Day {$d['day_number']}",
                'created_at' => DTime::toIso($d['claimed_at'])];
        }

        $social = $this->db->fetchAll(
            "SELECT ust.id, st.task_name, st.reward_amount, ust.completed_at FROM user_social_tasks ust
             JOIN social_tasks st ON ust.task_id = st.id WHERE ust.user_id = ?
             ORDER BY ust.completed_at DESC LIMIT 50", [$user['id']]
        );
        foreach ($social as $s) {
            $transactions[] = ['id' => 'social_' . $s['id'], 'amount' => floatval($s['reward_amount']),
                'type' => 'social_task', 'description' => "{$s['task_name']} Task",
                'created_at' => DTime::toIso($s['completed_at'])];
        }

        $refs = $this->db->fetchAll(
            "SELECT id, reward_amount, reward_type, created_at FROM referral_rewards
             WHERE referrer_id = ? ORDER BY created_at DESC LIMIT 50", [$user['id']]
        );
        foreach ($refs as $r) {
            $transactions[] = ['id' => 'ref_' . $r['id'], 'amount' => floatval($r['reward_amount']),
                'type' => 'referral', 'description' => "Referral Bonus - {$r['reward_type']}",
                'created_at' => DTime::toIso($r['created_at'])];
        }

        usort($transactions, function($a, $b) {
            return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
        });
        $transactions = array_slice($transactions, 0, 100);

        Response::success([
            'total_pnrp' => floatval($user['total_pnrp']),
            'level' => intval($user['level']),
            'transactions' => $transactions
        ]);
    }
}
