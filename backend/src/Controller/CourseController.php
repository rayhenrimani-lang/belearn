<?php

namespace App\Controller;

use App\Entity\Cours;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CourseController extends AbstractController
{
    #[Route('/api/courses', name: 'api_courses_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $items = $em->getRepository(Cours::class)->findBy([], ['titre' => 'ASC']);
        $data = array_map(static function (Cours $c) {
            $theme = $c->getTheme();
            $id = (int) ($c->getId() ?? 0);
            $rating = round(4.0 + (($id % 9) + 1) * 0.1, 1);

            return [
                'id' => $c->getId(),
                'title' => $c->getTitre(),
                'description' => $c->getDescription(),
                'instructorName' => $theme?->getNom() ?? 'Formateur BeLearn',
                'coverImage' => $theme?->getImageUrl(),
                'rating' => $rating,
            ];
        }, $items);

        return $this->json($data);
    }
}
