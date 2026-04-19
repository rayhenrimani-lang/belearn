<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Lecon;
use App\Entity\Quiz;
use App\Entity\Theme;
use App\Entity\Inscription;
use App\Entity\Utilisateur;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ORM\Entity]
#[ApiFilter(SearchFilter::class, properties: ['theme.id' => 'exact'])]
#[ApiResource(
    normalizationContext: ['groups' => ['course:read']]
)]
class Cours
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    #[Groups(['course:read','lesson:read'])]
    private ?int $id = null;

    #[ORM\Column(type:"string", length:255)]
    #[Groups(['course:read','lesson:read'])]
    private ?string $titre = null;

    #[ORM\Column(type:"text", nullable:true)]
    #[Groups(['course:read'])]
    private ?string $description = null;

    #[ORM\Column(type:"datetime")]
    #[Groups(['course:read'])]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column(type:"string", length:10)]
    #[Groups(['course:read'])]
    private ?string $statut = 'BROUILLON';

    // theme du cours
    #[ORM\ManyToOne(inversedBy: 'cours')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['course:read'])]
    private ?Theme $theme = null;

    // formateur propriétaire du cours
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['course:read'])]
    private ?Utilisateur $formateur = null;

    #[ORM\OneToMany(mappedBy:"cours", targetEntity:Lecon::class, cascade:["persist","remove"])]
    #[Groups(['course:read'])]
    private Collection $lecons;

    #[ORM\OneToMany(mappedBy:"cours", targetEntity:Quiz::class, cascade:["persist","remove"])]
    private Collection $quizzes;

    #[ORM\OneToMany(mappedBy:"cours", targetEntity:Inscription::class, cascade:["remove"])]
    private Collection $inscriptions;

    public function __construct()
    {
        $this->dateCreation = new \DateTime();
        $this->lecons = new ArrayCollection();
        $this->quizzes = new ArrayCollection();
        $this->inscriptions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): self
    {
        $this->dateCreation = $dateCreation;
        return $this;
    }

    public const STATUTS = ['BROUILLON','PUBLIE','VALIDE'];

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): self
    {
        if(!in_array($statut, self::STATUTS)){
            throw new \InvalidArgumentException("Statut invalide");
        }

        $this->statut = $statut;
        return $this;
    }

    public function getTheme(): ?Theme
    {
        return $this->theme;
    }

    public function setTheme(?Theme $theme): self
    {
        $this->theme = $theme;
        return $this;
    }

    public function getFormateur(): ?Utilisateur
    {
        return $this->formateur;
    }

    public function setFormateur(?Utilisateur $formateur): self
    {
        $this->formateur = $formateur;
        return $this;
    }

    #[Groups(['course:read'])]
    public function getThemeId(): ?int
    {
        return $this->theme?->getId();
    }

    public function getLecons(): Collection
    {
        return $this->lecons;
    }

    public function addLecon(Lecon $lecon): self
    {
        if(!$this->lecons->contains($lecon)){
            $this->lecons[] = $lecon;
            $lecon->setCours($this);
        }

        return $this;
    }

    public function removeLecon(Lecon $lecon): self
    {
        if($this->lecons->removeElement($lecon)){
            if($lecon->getCours() === $this){
                $lecon->setCours(null);
            }
        }

        return $this;
    }

    public function getQuizzes(): Collection
    {
        return $this->quizzes;
    }

    public function getInscriptions(): Collection
    {
        return $this->inscriptions;
    }
}