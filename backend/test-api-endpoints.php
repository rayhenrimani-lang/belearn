<?php

// Test API endpoints
$baseUrl = "http://192.168.61.185:8001/api";

echo "🚀 Testing MicroLearn API Endpoints\n\n";

// Test 1: Get Themes
echo "📚 1. Testing GET /api/themes\n";
$themes = file_get_contents($baseUrl . "/themes");
if ($themes) {
    echo "✅ Themes API working\n";
    $themesData = json_decode($themes, true);
    echo "📊 Found " . count($themesData) . " themes\n";
} else {
    echo "❌ Themes API failed\n";
}

echo "\n";

// Test 2: Get Courses
echo "🎓 2. Testing GET /api/cours\n";
$courses = file_get_contents($baseUrl . "/cours");
if ($courses) {
    echo "✅ Courses API working\n";
    $coursesData = json_decode($courses, true);
    echo "📊 Found " . count($coursesData) . " courses\n";
} else {
    echo "❌ Courses API failed\n";
}

echo "\n";

// Test 3: Get Lessons for Course 1
echo "📹 3. Testing GET /api/cours/1/lecons\n";
$lessons = file_get_contents($baseUrl . "/cours/1/lecons");
if ($lessons) {
    echo "✅ Lessons API working\n";
    $lessonsData = json_decode($lessons, true);
    echo "📊 Found " . count($lessonsData) . " lessons\n";
} else {
    echo "❌ Lessons API failed\n";
}

echo "\n🎯 API Testing Complete!\n";
echo "📱 You can now test the React Native app\n";
echo "🔗 Make sure your Symfony API is running on port 8001\n";
echo "🌐 API Base URL: " . htmlspecialchars($baseUrl, ENT_QUOTES, 'UTF-8') . "\n";
