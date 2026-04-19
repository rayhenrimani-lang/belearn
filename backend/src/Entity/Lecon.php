<?php
// src/Entity/Lecon.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Cours;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ApiFilter(SearchFilter::class, properties: ['cours.id' => 'exact'])]
#[ApiResource(
    normalizationContext: ['groups' => ['lesson:read']]
)]
class Lecon
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    #[Groups(['lesson:read'])]
    private ?int $id = null;

    // Relation avec Cours
    #[ORM\ManyToOne(targetEntity:Cours::class, inversedBy:"lecons")]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    #[Groups(['lesson:read'])]
    private ?Cours $cours = null;

    #[ORM\Column(type:"string", length:255)]
    #[Groups(['lesson:read'])]
    private ?string $titre = null;

    #[ORM\Column(type:"string", length:10)]
    #[Groups(['lesson:read'])]
    private ?string $type = 'VIDEO';

    #[ORM\Column(type:"text", nullable:true)]
    #[Groups(['lesson:read'])]
    private ?string $contenu = null;

    #[ORM\Column(type:"string", length:255, nullable:true)]
    #[Groups(['lesson:read'])]
    private ?string $urlVideo = null;

    #[ORM\Column(type:"integer", nullable:true)]
    #[Groups(['lesson:read'])]
    private ?int $ordre = null;

    #[ORM\Column(type:"integer", nullable:true)]
    #[Groups(['lesson:read'])]
    private ?int $duree = null;

    public const TYPES = ['VIDEO','TEXTE'];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCours(): ?Cours
    {
        return $this->cours;
    }

    public function setCours(Cours $cours): self
    {
        $this->cours = $cours;
        return $this;
    }

    /** Id du cours (JSON) — filtrage / client même si `cours` n’est qu’une IRI. */
    #[Groups(['lesson:read'])]
    public function getCoursId(): ?int
    {
        return $this->cours?->getId();
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): self
    {
        $this->titre = $titre;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        if(!in_array($type, self::TYPES)){
            throw new \InvalidArgumentException("Type de leçon invalide");
        }

        $this->type = $type;
        return $this;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(?string $contenu): self
    {
        $this->contenu = $contenu;
        return $this;
    }

    public function getUrlVideo(): ?string
    {
        return $this->urlVideo;
    }

    public function setUrlVideo(?string $urlVideo): self
    {
        $this->urlVideo = $urlVideo;
        return $this;
    }

    public function getOrdre(): ?int
    {
        return $this->ordre;
    }

    public function setOrdre(?int $ordre): self
    {
        $this->ordre = $ordre;
        return $this;
    }

    public function getDuree(): ?int
    {
        return $this->duree;
    }

    public function setDuree(?int $duree): self
    {
        $this->duree = $duree;
        return $this;
    }
}