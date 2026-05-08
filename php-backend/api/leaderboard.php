<?php
// Leaderboard API - returns top users (array)

class LeaderboardAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function get() {
        $users = $this->db->fetchAll(
            "SELECT username, full_name, total_pnrp, level FROM users
             ORDER BY total_pnrp DESC LIMIT 100"
        );
        $list = [];
        $rank = 1;
        foreach ($users as $u) {
            $list[] = ['rank' => $rank++, 'username' => $u['username'], 'name' => $u['full_name'],
                'total_pnrp' => floatval($u['total_pnrp']), 'level' => intval($u['level'])];
        }
        Response::raw($list);
    }
}
