<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserPasswordHasher implements ProcessorInterface
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Utilisateur || !$operation instanceof Post) {
            return $data;
        }

        $plain = $data->getPassword();
        if ($plain === null || $plain === '') {
            throw new \InvalidArgumentException('Le mot de passe est obligatoire.');
        }

        $data->setPassword($this->passwordHasher->hashPassword($data, $plain));

        $this->em->persist($data);
        $this->em->flush();

        return $data;
    }
}
