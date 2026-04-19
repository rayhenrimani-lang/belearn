<?php

namespace App\Controller;

use App\Entity\Theme;
use App\Entity\Cours;
use App\Entity\Lecon;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class LearningController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer
    ) {}

    #[Route('/themes', name: 'api_themes_list', methods: ['GET'])]
    public function getThemes(): JsonResponse
    {
        $themes = $this->em->getRepository(Theme::class)->findBy(
            [],
            ['dateCreation' => 'DESC']
        );

        $data = $this->serializer->serialize($themes, 'json', [
            'groups' => ['theme:read']
        ]);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/cours', name: 'api_cours_list', methods: ['GET'])]
    public function getCourses(): JsonResponse
    {
        $courses = $this->em->getRepository(Cours::class)->findBy(
            ['statut' => 'PUBLIE'],
            ['dateCreation' => 'DESC']
        );

        $data = $this->serializer->serialize($courses, 'json', [
            'groups' => ['course:read']
        ]);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/cours/theme/{themeId}', name: 'api_cours_by_theme', methods: ['GET'])]
    public function getCoursesByTheme(int $themeId): JsonResponse
    {
        $theme = $this->em->getRepository(Theme::class)->find($themeId);
        
        if (!$theme) {
            return new JsonResponse(['error' => 'Theme not found'], 404);
        }

        $courses = $this->em->getRepository(Cours::class)->findBy(
            ['theme' => $theme, 'statut' => 'PUBLIE'],
            ['dateCreation' => 'DESC']
        );

        $data = $this->serializer->serialize($courses, 'json', [
            'groups' => ['course:read']
        ]);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/cours/{id}/lecons', name: 'api_cours_lessons', methods: ['GET'])]
    public function getCourseLessons(int $id): JsonResponse
    {
        $course = $this->em->getRepository(Cours::class)->find($id);
        
        if (!$course) {
            return new JsonResponse(['error' => 'Course not found'], 404);
        }

        $lessons = $this->em->getRepository(Lecon::class)->findBy(
            ['cours' => $course],
            ['ordre' => 'ASC']
        );

        $data = $this->serializer->serialize($lessons, 'json', [
            'groups' => ['lesson:read']
        ]);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/cours/{id}', name: 'api_cours_show', methods: ['GET'])]
    public function getCourse(int $id): JsonResponse
    {
        $course = $this->em->getRepository(Cours::class)->find($id);
        
        if (!$course) {
            return new JsonResponse(['error' => 'Course not found'], 404);
        }

        $data = $this->serializer->serialize($course, 'json', [
            'groups' => ['course:read', 'lesson:read']
        ]);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/lecons/{id}', name: 'api_lecon_show', methods: ['GET'])]
    public function getLesson(int $id): JsonResponse
    {
        $lesson = $this->em->getRepository(Lecon::class)->find($id);
        
        if (!$lesson) {
            return new JsonResponse(['error' => 'Lesson not found'], 404);
        }

        $data = $this->serializer->serialize($lesson, 'json', [
            'groups' => ['lesson:read']
        ]);

        return new JsonResponse($data, 200, [], true);
    }
}
