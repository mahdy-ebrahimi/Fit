<?php
/**
 * FitGen Pro - cPanel PHP Configuration & CORS Handler
 */

// Allow CORS for API calls
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Helper to fetch Gemini API Key from environment or .env file
 */
function getGeminiApiKey() {
    // 1. Direct environment variable
    $envKey = getenv('GEMINI_API_KEY');
    if (!empty($envKey)) {
        return trim($envKey);
    }

    // 2. Read from .env in root directory
    $envFile = dirname(__DIR__) . '/.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, 'GEMINI_API_KEY=') === 0) {
                $val = trim(substr($line, 15));
                return trim($val, '"\'');
            }
        }
    }

    // 3. Fallback: You can put your key directly here if preferred
    return '';
}

/**
 * Send JSON response
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}
