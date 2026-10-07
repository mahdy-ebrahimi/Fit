<?php
/**
 * FitGen Pro - Alternative Exercise Endpoint (PHP for cPanel)
 */

require_once __DIR__ . '/config.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'متد درخواست باید POST باشد.'], 405);
}

// Read raw JSON body
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true);

$exercise = isset($body['exercise']) ? $body['exercise'] : null;
$profile = isset($body['profile']) ? $body['profile'] : [];
$reason = isset($body['reason']) ? $body['reason'] : '';

if (!$exercise) {
    sendJsonResponse(['error' => 'حرکت ورزشی مشخص نشده است.'], 400);
}

$apiKey = getGeminiApiKey();
$alt = null;

if (!empty($apiKey)) {
    try {
        $prompt = "حرکت اصلی: " . ($exercise['nameFa'] ?? '') . " (" . ($exercise['nameEn'] ?? '') . ")، عضله هدف: " . ($exercise['targetMuscle'] ?? '') . "، دلیل جایگزینی: " . $reason . ".\nیک حرکت جایگزین بیومکانیکی امن و مؤثر به زبان فارسی در قالب JSON با کلیدهای nameFa, nameEn, targetMuscle, equipmentNeeded, sets, reps, restSeconds, cue, whyItsBetter, safetyNote تولید کن.";

        $requestPayload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $prompt]]
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
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($response)) {
            $responseData = json_decode($response, true);
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                $rawJson = $responseData['candidates'][0]['content']['parts'][0]['text'];
                $parsed = json_decode($rawJson, true);
                if (isset($parsed['alternative'])) {
                    $alt = $parsed['alternative'];
                } else if (isset($parsed['nameFa'])) {
                    $alt = $parsed;
                }
            }
        }
    } catch (Exception $e) {
        error_log('Alternative cPanel Error: ' . $e->getMessage());
    }
}

// Fallback alternative if Gemini is absent or failed
if (!$alt) {
    $muscle = $exercise['targetMuscle'] ?? 'عضله هدف';
    $alt = [
        'nameFa' => "دمبل ایزوله جایگزین $muscle",
        'nameEn' => "Dumbbell Alternative for " . ($exercise['nameEn'] ?? $muscle),
        'targetMuscle' => $muscle,
        'equipmentNeeded' => 'دمبل با وزن قابل کنترل',
        'sets' => $exercise['sets'] ?? 3,
        'reps' => $exercise['reps'] ?? '10-12',
        'restSeconds' => $exercise['restSeconds'] ?? 60,
        'cue' => 'دامنه کنترل‌شده با مکث ۱ ثانیه‌ای در اوج انقباض و فاز منفی ۳ ثانیه‌ای',
        'whyItsBetter' => 'کاهش فشار اهرمی بر روی تاندون‌ها و آزادی بیشتر مفاصل و تطابق با تجهیزات در دسترس',
        'safetyNote' => 'در صورت احساس هرگونه تیر کشیدن غیرطبیعی، وزنه را سبک‌تر کنید.'
    ];
}

sendJsonResponse([
    'success' => true,
    'alternative' => $alt
]);
