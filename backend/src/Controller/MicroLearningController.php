<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api')]
class MicroLearningController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    private function getConnection()
    {
        return $this->entityManager->getConnection();
    }

    #[Route('/themes', name: 'api_themes', methods: ['GET'])]
    public function getThemes(): JsonResponse
    {
        $conn = $this->getConnection();
        
        $sql = "
            SELECT id, nom, description, image_url, date_creation 
            FROM theme 
            ORDER BY date_creation DESC
        ";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery();
        $themes = $result->fetchAllAssociative();
        
        // Format date creation to ISO format
        foreach ($themes as &$theme) {
            if ($theme['date_creation']) {
                $theme['date_creation'] = (new \DateTime($theme['date_creation']))->format('c');
            }
        }
        
        return new JsonResponse($themes);
    }

    #[Route('/themes/{id}/cours', name: 'api_themes_cours', methods: ['GET'])]
    public function getCoursesByTheme(int $id): JsonResponse
    {
        $conn = $this->getConnection();
        
        $sql = "
            SELECT id, titre, description, date_creation, statut, theme_id 
            FROM cours 
            WHERE theme_id = :themeId 
            ORDER BY date_creation DESC
        ";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['themeId' => $id]);
        $courses = $result->fetchAllAssociative();
        
        // Format date creation to ISO format
        foreach ($courses as &$course) {
            if ($course['date_creation']) {
                $course['date_creation'] = (new \DateTime($course['date_creation']))->format('c');
            }
        }
        
        return new JsonResponse($courses);
    }

    #[Route('/cours/{id}/lecons', name: 'api_cours_lecons', methods: ['GET'])]
    public function getLessonsByCourse(int $id): JsonResponse
    {
        $conn = $this->getConnection();
        
        $sql = "
            SELECT id, titre, type, contenu, url_video, ordre, cours_id, duree 
            FROM lecon 
            WHERE cours_id = :courseId 
            ORDER BY ordre ASC
        ";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['courseId' => $id]);
        $lessons = $result->fetchAllAssociative();
        
        return new JsonResponse($lessons);
    }

    #[Route('/cours/{id}', name: 'api_cours_show', methods: ['GET'])]
    public function getCourse(int $id): JsonResponse
    {
        $conn = $this->getConnection();
        
        $sql = "
            SELECT c.id, c.titre, c.description, c.date_creation, c.statut, c.theme_id,
                   t.nom as theme_nom, t.description as theme_description
            FROM cours c
            LEFT JOIN theme t ON c.theme_id = t.id
            WHERE c.id = :courseId
        ";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['courseId' => $id]);
        $course = $result->fetchAssociative();
        
        if (!$course) {
            return new JsonResponse(['error' => 'Course not found'], 404);
        }
        
        // Format date creation
        if ($course['date_creation']) {
            $course['date_creation'] = (new \DateTime($course['date_creation']))->format('c');
        }
        
        return new JsonResponse($course);
    }

    #[Route('/themes/{id}', name: 'api_theme_show', methods: ['GET'])]
    public function getTheme(int $id): JsonResponse
    {
        $conn = $this->getConnection();
        
        $sql = "
            SELECT id, nom, description, image_url, date_creation 
            FROM theme 
            WHERE id = :themeId
        ";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['themeId' => $id]);
        $theme = $result->fetchAssociative();
        
        if (!$theme) {
            return new JsonResponse(['error' => 'Theme not found'], 404);
        }
        
        // Format date creation
        if ($theme['date_creation']) {
            $theme['date_creation'] = (new \DateTime($theme['date_creation']))->format('c');
        }
        
        return new JsonResponse($theme);
    }

    #[Route('/stats', name: 'api_stats', methods: ['GET'])]
    public function getStats(): JsonResponse
    {
        $conn = $this->getConnection();
        
        $themesCount = $conn->fetchOne("SELECT COUNT(*) FROM theme");
        $coursesCount = $conn->fetchOne("SELECT COUNT(*) FROM cours");
        $lessonsCount = $conn->fetchOne("SELECT COUNT(*) FROM lecon");
        
        return new JsonResponse([
            'themes_count' => (int)$themesCount,
            'courses_count' => (int)$coursesCount,
            'lessons_count' => (int)$lessonsCount
        ]);
    }
}
