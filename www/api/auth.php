<?php
/**
 * Authentication API
 * Handles user registration, login, and authentication
 */

require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegister();
        break;

    case 'login':
        handleLogin();
        break;

    case 'verify':
        handleVerify();
        break;

    default:
        sendError('Invalid action', 400);
}

/**
 * Handle User Registration
 */
function handleRegister() {
    $data = getRequestBody();

    // Validate input
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        sendError('Name, email, and password are required');
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];

    // Validate email
    if (!validateEmail($email)) {
        sendError('Invalid email format');
    }

    // Validate password length
    if (strlen($password) < 6) {
        sendError('Password must be at least 6 characters');
    }

    // Check if user already exists
    $db = getDB();
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        sendError('Email already registered');
    }

    // Hash password
    $hashedPassword = hashPassword($password);

    // Insert user
    $stmt = $db->prepare("
        INSERT INTO users (name, email, password, created_at)
        VALUES (?, ?, ?, NOW())
    ");

    $stmt->execute([$name, $email, $hashedPassword]);

    sendResponse([
        'success' => true,
        'message' => 'User registered successfully'
    ], 201);
}

/**
 * Handle User Login
 */
function handleLogin() {
    $data = getRequestBody();

    // Validate input
    if (empty($data['email']) || empty($data['password'])) {
        sendError('Email and password are required');
    }

    $email = trim($data['email']);
    $password = $data['password'];

    // Get user from database
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('Invalid email or password', 401);
    }

    // Verify password
    if (!verifyPassword($password, $user['password'])) {
        sendError('Invalid email or password', 401);
    }

    // Generate token
    $token = generateToken($user['id'], $user['email']);

    sendResponse([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
}

/**
 * Verify Token
 */
function handleVerify() {
    $user = getCurrentUser();

    // Get user details from database
    $db = getDB();
    $stmt = $db->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->execute([$user['user_id']]);
    $userData = $stmt->fetch();

    if (!$userData) {
        sendError('User not found', 404);
    }

    sendResponse([
        'success' => true,
        'user' => $userData
    ]);
}
