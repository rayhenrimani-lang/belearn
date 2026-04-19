<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController extends AbstractController
{
    /**
     * Not used for successful JWT issuance: json_login + Lexik handle that.
     * This runs only when the request is not accepted as JSON login (wrong Content-Type, etc.).
     */
    public function apiLogin(): JsonResponse
    {
        return $this->json([
            'error' => 'Content-Type application/json requis, avec les champs "email" et "password".',
        ], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        // Vérifier si email déjà utilisé
        $existingUser = $em->getRepository(Utilisateur::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existingUser) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        $user = new Utilisateur();
        $user->setEmail($data['email']);
        $nom = !empty($data['nom']) ? (string) $data['nom'] : (strstr($data['email'], '@', true) ?: 'User');
        $user->setNom($nom);
        $user->setPrenom($data['prenom'] ?? '');
        $user->setTelephone($data['telephone'] ?? '');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur créé avec succès'], Response::HTTP_CREATED);
    }
}