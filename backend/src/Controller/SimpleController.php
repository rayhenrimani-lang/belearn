<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class SimpleController extends AbstractController
{
    #[Route('/themes', name: 'api_themes', methods: ['GET'])]
    public function getThemes(): JsonResponse
    {
        try {
            // Database connection
            $host = 'localhost';
            $dbname = 'belearn';
            $username = 'root';
            $password = '';
            
            $pdo = new \PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            
            $sql = "SELECT id, nom, description, image_url, date_creation FROM theme ORDER BY date_creation DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $themes = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            // Format date creation
            foreach ($themes as &$theme) {
                if ($theme['date_creation']) {
                    $theme['date_creation'] = (new \DateTime($theme['date_creation']))->format('c');
                }
            }
            
            return new JsonResponse($themes);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/themes/{id}/cours', name: 'api_themes_cours', methods: ['GET'])]
    public function getCoursesByTheme(int $id): JsonResponse
    {
        try {
            // Database connection
            $host = 'localhost';
            $dbname = 'belearn';
            $username = 'root';
            $password = '';
            
            $pdo = new \PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            
            $sql = "SELECT id, titre, description, date_creation, statut, theme_id FROM cours WHERE theme_id = :themeId ORDER BY date_creation DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['themeId' => $id]);
            $courses = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            // Format date creation
            foreach ($courses as &$course) {
                if ($course['date_creation']) {
                    $course['date_creation'] = (new \DateTime($course['date_creation']))->format('c');
                }
            }
            
            return new JsonResponse($courses);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/cours/{id}/lecons', name: 'api_cours_lecons', methods: ['GET'])]
    public function getLessonsByCourse(int $id): JsonResponse
    {
        try {
            // Database connection
            $host = 'localhost';
            $dbname = 'belearn';
            $username = 'root';
            $password = '';
            
            $pdo = new \PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            
            $sql = "SELECT id, titre, type, contenu, url_video, ordre, cours_id, duree FROM lecon WHERE cours_id = :courseId ORDER BY ordre ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['courseId' => $id]);
            $lessons = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            return new JsonResponse($lessons);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/stats', name: 'api_stats', methods: ['GET'])]
    public function getStats(): JsonResponse
    {
        try {
            // Database connection
            $host = 'localhost';
            $dbname = 'belearn';
            $username = 'root';
            $password = '';
            
            $pdo = new \PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            
            $themesCount = $pdo->query("SELECT COUNT(*) FROM theme")->fetchColumn();
            $coursesCount = $pdo->query("SELECT COUNT(*) FROM cours")->fetchColumn();
            $lessonsCount = $pdo->query("SELECT COUNT(*) FROM lecon")->fetchColumn();
            
            return new JsonResponse([
                'themes_count' => (int)$themesCount,
                'courses_count' => (int)$coursesCount,
                'lessons_count' => (int)$lessonsCount
            ]);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
