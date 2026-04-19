<?php
// src/Entity/Apprenant.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ApiResource]
class Apprenant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity:Utilisateur::class, cascade:["persist","remove"])]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Utilisateur $utilisateur = null;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $dateInscription = null;

    // 🔗 inscriptions (cours)
    #[ORM\OneToMany(mappedBy:"apprenant", targetEntity:Inscription::class)]
    private Collection $inscriptions;

    // 🔗 tentatives quiz
    #[ORM\OneToMany(mappedBy:"apprenant", targetEntity:TentativeQuiz::class)]
    private Collection $tentatives;

    // 🔗 badges
    #[ORM\OneToMany(mappedBy:"apprenant", targetEntity:ApprenantBadge::class)]
    private Collection $badges;

    public function __construct()
    {
        $this->dateInscription = new \DateTime();
        $this->inscriptions = new ArrayCollection();
        $this->tentatives = new ArrayCollection();
        $this->badges = new ArrayCollection();
    }

    // ---------- getters setters ----------

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(Utilisateur $u): self
    {
        $this->utilisateur = $u;
        return $this;
    }

    public function getDateInscription(): ?\DateTimeInterface
    {
        return $this->dateInscription;
    }

    public function setDateInscription(\DateTimeInterface $d): self
    {
        $this->dateInscription = $d;
        return $this;
    }

    // -------- inscriptions --------

    public function getInscriptions(): Collection
    {
        return $this->inscriptions;
    }

    // -------- tentatives --------

    public function getTentatives(): Collection
    {
        return $this->tentatives;
    }

    // -------- badges --------

    public function getBadges(): Collection
    {
        return $this->badges;
    }
}