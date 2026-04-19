<?php
// src/Entity/Administrateur.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Utilisateur;

#[ORM\Entity]
#[ApiResource]
class Administrateur
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Utilisateur::class, cascade: ["persist", "remove"])]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Utilisateur $utilisateur = null;

    // --- Getters & Setters ---
    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(Utilisateur $utilisateur): self
    {
        $this->utilisateur = $utilisateur;
        return $this;
    }
}