<?php
/**
 * FitGen Pro - Generate Full Plan Endpoint (PHP for cPanel)
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/fallback_generator.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'متد درخواست باید POST باشد.'], 405);
}

// Read raw JSON body
$rawInput = file_get_contents('php://input');
$profile = json_decode($rawInput, true);

if (!$profile || empty($profile['weight']) || empty($profile['height'])) {
    sendJsonResponse(['error' => 'وزن و قد کاربر الزامی است.'], 400);
}

$apiKey = getGeminiApiKey();
$planData = null;

// If Gemini API Key exists, try calling Google Gemini REST API directly
if (!empty($apiKey)) {
    try {
        $systemInstruction = "تو یک مربی ارشد و نخبه بدنسازی (IFBB Pro Coach)، متخصص تغذیه ورزشی و فیزیوتراپیست با ۲۰ سال سابقه هستی. وظیفه تو طراحی یک برنامه فوق‌العاده دقیق، علمی، حرفه‌ای و شخصی‌سازی شده برای بدنسازی و تغذیه کاربر است. خروجی باید یک شیء JSON با ساختار کامل شامل summary, workoutPlan, dietPlan, supplementPlan باشد.";

        $userPrompt = "مشخصات متقاضی برای طراحی برنامه بدنسازی و تغذیه با هوش مصنوعی Google Gemini: " . json_encode($profile, JSON_UNESCAPED_UNICODE) . " لطفا برنامه کامل با فرمت JSON تولید کن.";

        $requestPayload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $systemInstruction . "\n\n" . $userPrompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.4
            ]
        ];

        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);

        $ch = curl_init($apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestPayload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($response)) {
            $responseData = json_decode($response, true);
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                $rawJson = $responseData['candidates'][0]['content']['parts'][0]['text'];
                $planData = json_decode($rawJson, true);
            }
        }
    } catch (Exception $e) {
        error_log('Gemini cPanel PHP Error: ' . $e->getMessage());
    }
}

// If Gemini is not set or response is missing keys, use scientific fallback
if (!$planData || !isset($planData['summary']) || !isset($planData['workoutPlan'])) {
    $planData = generateScientificFallbackPlanPHP($profile);
}

sendJsonResponse([
    'success' => true,
    'plan' => $planData
]);
