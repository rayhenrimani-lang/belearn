<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/api/users', name: 'api_users_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $users = $em->getRepository(Utilisateur::class)->findAll();
        $data = array_map(static function (Utilisateur $u) {
            return [
                'id' => $u->getId(),
                'email' => $u->getEmail(),
                'nom' => $u->getNom(),
                'prenom' => $u->getPrenom(),
            ];
        }, $users);

        return $this->json($data);
    }
}
