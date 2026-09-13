<?php
/**
 * API Health Check
 * Simple endpoint to check if the API is available
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

echo json_encode([
    'status' => 'ok',
    'message' => 'Timer Manager API is running',
    'timestamp' => time()
]);
