<?php
/**
 * FitGen Pro - cPanel Health Check Endpoint
 */
require_once __DIR__ . '/config.php';

$hasApiKey = !empty(getGeminiApiKey());

sendJsonResponse([
    'status' => 'ok',
    'app' => 'FitGen Pro (PHP Backend)',
    'php_version' => PHP_VERSION,
    'gemini_api_configured' => $hasApiKey,
    'server_time' => date('Y-m-d H:i:s'),
    'message' => 'هاست سی‌پنل شما و وب‌سرور PHP کاملاً متصل و فعال هستند.'
]);
