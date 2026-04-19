<?php

// Test API endpoints
$baseUrl = "http://localhost:8001/api";

echo "Testing API endpoints...\n";

// Test themes endpoint
echo "1. Testing GET /api/themes\n";
$themes = file_get_contents($baseUrl . "/themes");
if ($themes) {
    echo "SUCCESS: Themes API working\n";
    $themesData = json_decode($themes, true);
    echo "Found " . count($themesData) . " themes\n";
    if (count($themesData) > 0) {
        echo "First theme: " . $themesData[0]['nom'] . "\n";
    }
} else {
    echo "ERROR: Themes API failed\n";
}

echo "\n";

// Test courses endpoint
echo "2. Testing GET /api/themes/1/cours\n";
$courses = file_get_contents($baseUrl . "/themes/1/cours");
if ($courses) {
    echo "SUCCESS: Courses API working\n";
    $coursesData = json_decode($courses, true);
    echo "Found " . count($coursesData) . " courses\n";
    if (count($coursesData) > 0) {
        echo "First course: " . $coursesData[0]['titre'] . "\n";
    }
} else {
    echo "ERROR: Courses API failed\n";
}

echo "\n";

// Test lessons endpoint
echo "3. Testing GET /api/cours/1/lecons\n";
$lessons = file_get_contents($baseUrl . "/cours/1/lecons");
if ($lessons) {
    echo "SUCCESS: Lessons API working\n";
    $lessonsData = json_decode($lessons, true);
    echo "Found " . count($lessonsData) . " lessons\n";
    if (count($lessonsData) > 0) {
        echo "First lesson: " . $lessonsData[0]['titre'] . "\n";
    }
} else {
    echo "ERROR: Lessons API failed\n";
}

echo "\nAPI testing complete!\n";
?>
