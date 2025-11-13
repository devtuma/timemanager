<?php
/**
 * Projects API
 * Handles CRUD operations for projects
 */

require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        handleList();
        break;

    case 'get':
        handleGet();
        break;

    case 'create':
        handleCreate();
        break;

    case 'update':
        handleUpdate();
        break;

    case 'delete':
        handleDelete();
        break;

    default:
        sendError('Invalid action', 400);
}

/**
 * Get all projects for current user
 */
function handleList() {
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare("
        SELECT id, name, totalTime, points, created_at, updated_at
        FROM projects
        WHERE user_id = ?
        ORDER BY updated_at DESC
    ");

    $stmt->execute([$user['user_id']]);
    $projects = $stmt->fetchAll();

    // Decode JSON points
    foreach ($projects as &$project) {
        $project['points'] = json_decode($project['points'], true) ?? [];
        $project['totalTime'] = (int)$project['totalTime'];
    }

    sendResponse($projects);
}

/**
 * Get single project
 */
function handleGet() {
    $user = getCurrentUser();
    $projectId = $_GET['id'] ?? null;

    if (!$projectId) {
        sendError('Project ID is required');
    }

    $db = getDB();
    $stmt = $db->prepare("
        SELECT id, name, totalTime, points, created_at, updated_at
        FROM projects
        WHERE id = ? AND user_id = ?
    ");

    $stmt->execute([$projectId, $user['user_id']]);
    $project = $stmt->fetch();

    if (!$project) {
        sendError('Project not found', 404);
    }

    // Decode JSON points
    $project['points'] = json_decode($project['points'], true) ?? [];
    $project['totalTime'] = (int)$project['totalTime'];

    sendResponse($project);
}

/**
 * Create new project
 */
function handleCreate() {
    $user = getCurrentUser();
    $data = getRequestBody();

    // Validate input
    if (empty($data['name'])) {
        sendError('Project name is required');
    }

    if (!isset($data['totalTime']) || $data['totalTime'] <= 0) {
        sendError('Total time must be greater than 0');
    }

    $name = trim($data['name']);
    $totalTime = (int)$data['totalTime'];
    $points = json_encode($data['points'] ?? []);

    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO projects (user_id, name, totalTime, points, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    ");

    $stmt->execute([$user['user_id'], $name, $totalTime, $points]);

    $projectId = $db->lastInsertId();

    sendResponse([
        'success' => true,
        'project' => [
            'id' => $projectId,
            'name' => $name,
            'totalTime' => $totalTime,
            'points' => json_decode($points, true)
        ]
    ], 201);
}

/**
 * Update existing project
 */
function handleUpdate() {
    $user = getCurrentUser();
    $data = getRequestBody();

    // Validate input
    if (empty($data['id'])) {
        sendError('Project ID is required');
    }

    if (empty($data['name'])) {
        sendError('Project name is required');
    }

    if (!isset($data['totalTime']) || $data['totalTime'] <= 0) {
        sendError('Total time must be greater than 0');
    }

    $projectId = $data['id'];
    $name = trim($data['name']);
    $totalTime = (int)$data['totalTime'];
    $points = json_encode($data['points'] ?? []);

    // Check if project exists and belongs to user
    $db = getDB();
    $stmt = $db->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
    $stmt->execute([$projectId, $user['user_id']]);

    if (!$stmt->fetch()) {
        sendError('Project not found', 404);
    }

    // Update project
    $stmt = $db->prepare("
        UPDATE projects
        SET name = ?, totalTime = ?, points = ?, updated_at = NOW()
        WHERE id = ? AND user_id = ?
    ");

    $stmt->execute([$name, $totalTime, $points, $projectId, $user['user_id']]);

    sendResponse([
        'success' => true,
        'project' => [
            'id' => $projectId,
            'name' => $name,
            'totalTime' => $totalTime,
            'points' => json_decode($points, true)
        ]
    ]);
}

/**
 * Delete project
 */
function handleDelete() {
    $user = getCurrentUser();
    $projectId = $_GET['id'] ?? null;

    if (!$projectId) {
        sendError('Project ID is required');
    }

    $db = getDB();

    // Check if project exists and belongs to user
    $stmt = $db->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
    $stmt->execute([$projectId, $user['user_id']]);

    if (!$stmt->fetch()) {
        sendError('Project not found', 404);
    }

    // Delete project
    $stmt = $db->prepare("DELETE FROM projects WHERE id = ? AND user_id = ?");
    $stmt->execute([$projectId, $user['user_id']]);

    sendResponse([
        'success' => true,
        'message' => 'Project deleted successfully'
    ]);
}
