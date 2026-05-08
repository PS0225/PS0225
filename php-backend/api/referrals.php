<?php
// Referrals API

class ReferralsAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function get() {
        $user = JWT::requireUser();
        $refs = $this->db->fetchAll(
            "SELECT username, full_name, created_at, total_pnrp FROM users WHERE referred_by = ?
             ORDER BY created_at DESC", [$user['id']]
        );
        $earnedRow = $this->db->fetchOne(
            "SELECT SUM(reward_amount) AS total FROM referral_rewards WHERE referrer_id = ?",
            [$user['id']]
        );
        $totalEarned = $earnedRow && $earnedRow['total'] ? floatval($earnedRow['total']) : 0.0;

        $list = [];
        foreach ($refs as $r) {
            $list[] = ['username' => $r['username'], 'name' => $r['full_name'],
                'joined_date' => DTime::toIso($r['created_at']),
                'total_pnrp' => floatval($r['total_pnrp'])];
        }

        Response::success([
            'referral_code' => $user['referral_code'],
            'total_referrals' => count($list),
            'total_earned' => $totalEarned,
            'referrals' => $list
        ]);
    }
}
