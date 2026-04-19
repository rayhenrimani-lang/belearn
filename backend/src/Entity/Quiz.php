<?php

// src/Entity/Quiz.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ApiResource]
class Quiz
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    // --- Relation ManyToOne → Cours ---
    #[ORM\ManyToOne(targetEntity: Cours::class, inversedBy: 'quizzes')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Cours $cours = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'string', length: 10)]
    private ?string $type = 'MANUEL';

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $dateCreation = null;

    // --- Relation OneToMany → TentativeQuiz ---
    #[ORM\OneToMany(mappedBy: 'quiz', targetEntity: TentativeQuiz::class, cascade: ['persist', 'remove'])]
    private Collection $tentatives;

    // --- Constructor ---
    public function __construct()
    {
        $this->tentatives = new ArrayCollection();
        $this->dateCreation = new \DateTime();
    }

    // --- ENUM simulation ---
    public const TYPES = ['MANUEL', 'IA'];

    // --- Getters & Setters ---
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        if (!in_array($type, self::TYPES)) {
            throw new \InvalidArgumentException('Type de quiz invalide');
        }
        $this->type = $type;

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

    // --- Tentatives ---
    /** @return Collection|TentativeQuiz[] */
    public function getTentatives(): Collection
    {
        return $this->tentatives;
    }

    public function addTentative(TentativeQuiz $tentative): self
    {
        if (!$this->tentatives->contains($tentative)) {
            $this->tentatives[] = $tentative;
            $tentative->setQuiz($this);
        }

        return $this;
    }

    public function removeTentative(TentativeQuiz $tentative): self
    {
        if ($this->tentatives->removeElement($tentative)) {
            if ($tentative->getQuiz() === $this) {
                $tentative->setQuiz(null);
            }
        }

        return $this;
    }
}
