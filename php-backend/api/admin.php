<?php
// Admin APIs

class AdminAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function stats() {
        JWT::requireAdmin();
        $row = $this->db->fetchOne("SELECT COUNT(*) AS cnt FROM users");
        $totalUsers = intval($row['cnt']);
        $row = $this->db->fetchOne("SELECT SUM(total_pnrp) AS total FROM users");
        $totalPnrp = $row && $row['total'] ? floatval($row['total']) : 0.0;
        $row = $this->db->fetchOne(
            "SELECT SUM(base_reward * speed_multiplier) AS total FROM mining_sessions
             WHERE status = 'completed'"
        );
        $totalMiningPnrp = $row && $row['total'] ? floatval($row['total']) : 0.0;
        $row = $this->db->fetchOne("SELECT COUNT(*) AS cnt FROM mining_sessions WHERE status = 'active'");
        $activeMining = intval($row['cnt']);
        $row = $this->db->fetchOne("SELECT COUNT(*) AS cnt FROM ad_interactions");
        $totalTransactions = intval($row['cnt']);

        Response::success([
            'total_users' => $totalUsers,
            'total_pnrp_distributed' => $totalPnrp,
            'total_mining_pnrp' => $totalMiningPnrp,
            'active_mining_sessions' => $activeMining,
            'total_transactions' => $totalTransactions
        ]);
    }

    public function users() {
        JWT::requireAdmin();
        $users = $this->db->fetchAll(
            "SELECT id, username, full_name, email, total_pnrp, level, created_at
             FROM users ORDER BY created_at DESC"
        );
        $list = [];
        foreach ($users as $u) {
            $list[] = [
                'id' => $u['id'], 'username' => $u['username'], 'name' => $u['full_name'],
                'email' => $u['email'], 'total_pnrp' => floatval($u['total_pnrp']),
                'level' => intval($u['level']), 'created_at' => DTime::toIso($u['created_at'])
            ];
        }
        Response::success(['users' => $list]);
    }
}
