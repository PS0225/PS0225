<?php
// Social Tasks API

class SocialTasksAPI {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    public function getTasks() {
        $user = JWT::requireUser();
        $tasks = $this->db->fetchAll("SELECT * FROM social_tasks WHERE is_active = 1");
        $completedRows = $this->db->fetchAll(
            "SELECT task_id FROM user_social_tasks WHERE user_id = ?", [$user['id']]
        );
        $completedIds = [];
        foreach ($completedRows as $c) $completedIds[$c['task_id']] = true;

        $list = [];
        foreach ($tasks as $t) {
            $list[] = [
                'id' => $t['id'], 'platform' => $t['platform'], 'task_name' => $t['task_name'],
                'reward' => floatval($t['reward_amount']), 'url' => $t['task_url'],
                'completed' => isset($completedIds[$t['id']])
            ];
        }
        Response::success(['tasks' => $list]);
    }

    public function complete($task_id) {
        $user = JWT::requireUser();
        $task = $this->db->fetchOne("SELECT * FROM social_tasks WHERE id = ?", [$task_id]);
        if (!$task) Response::error('Task not found', 404);

        $existing = $this->db->fetchOne(
            "SELECT id FROM user_social_tasks WHERE user_id = ? AND task_id = ?",
            [$user['id'], $task_id]
        );
        if ($existing) Response::error('Task already completed', 400);

        $this->db->execute(
            "INSERT INTO user_social_tasks (id, user_id, task_id, completed_at) VALUES (?, ?, ?, ?)",
            [UUID::v4(), $user['id'], $task_id, DTime::nowMysql()]
        );
        $reward = floatval($task['reward_amount']);
        $this->db->execute("UPDATE users SET total_pnrp = total_pnrp + ? WHERE id = ?",
            [$reward, $user['id']]);
        Response::success([
            'message' => 'Social task completed successfully',
            'reward' => $reward, 'new_balance' => floatval($user['total_pnrp']) + $reward
        ]);
    }
}
