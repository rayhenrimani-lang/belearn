<?php

// Simple API file for Micro-Learning Platform
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$host = 'localhost';
$dbname = 'belearn';
$username = 'root';
$password = '';

try {
    $pdo = new \PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get the request path
$path = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
$path = str_replace('/api', '', $path);
$path = explode('?', $path)[0]; // Remove query parameters

// Route the request
switch (true) {
    case $path === '/themes':
        handleThemes($pdo);
        break;
        
    case preg_match('/^\/themes\/(\d+)\/cours$/', $path, $matches):
        handleCoursesByTheme($pdo, $matches[1]);
        break;
        
    case preg_match('/^\/cours\/(\d+)\/lecons$/', $path, $matches):
        handleLessonsByCourse($pdo, $matches[1]);
        break;
        
    case $path === '/stats':
        handleStats($pdo);
        break;
        
    default:
        echo json_encode(['error' => 'Endpoint not found: ' . $path]);
        break;
}

function handleThemes($pdo) {
    try {
        $sql = "SELECT id, nom, description, image_url, date_creation FROM theme ORDER BY date_creation DESC";
        $stmt = $pdo->query($sql);
        $themes = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        // Format date creation
        foreach ($themes as &$theme) {
            if ($theme['date_creation']) {
                $theme['date_creation'] = (new \DateTime($theme['date_creation']))->format('c');
            }
        }
        
        echo json_encode($themes);
    } catch (\Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleCoursesByTheme($pdo, $themeId) {
    try {
        $sql = "SELECT id, titre, description, date_creation, statut, theme_id FROM cours WHERE theme_id = :themeId ORDER BY date_creation DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['themeId' => $themeId]);
        $courses = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        // Format date creation
        foreach ($courses as &$course) {
            if ($course['date_creation']) {
                $course['date_creation'] = (new \DateTime($course['date_creation']))->format('c');
            }
        }
        
        echo json_encode($courses);
    } catch (\Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleLessonsByCourse($pdo, $courseId) {
    try {
        $sql = "SELECT id, titre, type, contenu, url_video, ordre, cours_id, duree FROM lecon WHERE cours_id = :courseId ORDER BY ordre ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['courseId' => $courseId]);
        $lessons = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode($lessons);
    } catch (\Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleStats($pdo) {
    try {
        $themesCount = $pdo->query("SELECT COUNT(*) FROM theme")->fetchColumn();
        $coursesCount = $pdo->query("SELECT COUNT(*) FROM cours")->fetchColumn();
        $lessonsCount = $pdo->query("SELECT COUNT(*) FROM lecon")->fetchColumn();
        
        echo json_encode([
            'themes_count' => (int)$themesCount,
            'courses_count' => (int)$coursesCount,
            'lessons_count' => (int)$lessonsCount
        ]);
    } catch (\Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
