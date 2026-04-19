<?php
// src/Entity/TentativeQuiz.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Quiz;
use App\Entity\Apprenant;

#[ORM\Entity]
#[ApiResource]
class TentativeQuiz
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity:Quiz::class, inversedBy:"tentatives")]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Quiz $quiz = null;

    #[ORM\ManyToOne(targetEntity:Apprenant::class, inversedBy:"tentatives")]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Apprenant $apprenant = null;

    #[ORM\Column(type:"float", nullable:true)]
    private ?float $score = null;

    #[ORM\Column(type:"datetime")]
    private ?\DateTimeInterface $dateTentative = null;

    #[ORM\Column(type:"integer", nullable:true)]
    private ?int $duree = null;

    public function __construct() { $this->dateTentative = new \DateTime(); }

    // Getters & Setters ...
    public function getId(): ?int { return $this->id; }
    public function getQuiz(): ?Quiz { return $this->quiz; }
    public function setQuiz(?Quiz $quiz): self { $this->quiz = $quiz; return $this; }
    public function getApprenant(): ?Apprenant { return $this->apprenant; }
    public function setApprenant(?Apprenant $a): self { $this->apprenant = $a; return $this; }
    public function getScore(): ?float { return $this->score; }
    public function setScore(?float $score): self { $this->score = $score; return $this; }
    public function getDateTentative(): ?\DateTimeInterface { return $this->dateTentative; }
    public function setDateTentative(\DateTimeInterface $d): self { $this->dateTentative = $d; return $this; }
    public function getDuree(): ?int { return $this->duree; }
    public function setDuree(?int $d): self { $this->duree = $d; return $this; }
}