<?php
// src/Entity/Progression.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Apprenant;

#[ORM\Entity]
#[ApiResource]
class Progression
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity:Apprenant::class, cascade:["persist","remove"])]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Apprenant $apprenant = null;

    #[ORM\Column(type:"float")]
    private ?float $pourcentage = 0;

    #[ORM\Column(type:"integer")]
    private ?int $leconsTerminees = 0;

    #[ORM\Column(type:"integer")]
    private ?int $quizReussis = 0;

    #[ORM\Column(type:"datetime")]
    private ?\DateTimeInterface $derniereActivite = null;

    public function __construct(){ $this->derniereActivite = new \DateTime(); }

    // Getters & Setters ...
    public function getApprenant(): ?Apprenant { return $this->apprenant; }
    public function setApprenant(Apprenant $a): self { $this->apprenant = $a; return $this; }
    public function getPourcentage(): ?float { return $this->pourcentage; }
    public function setPourcentage(float $p): self { $this->pourcentage = $p; return $this; }
    public function getLeconsTerminees(): ?int { return $this->leconsTerminees; }
    public function setLeconsTerminees(int $l): self { $this->leconsTerminees = $l; return $this; }
    public function getQuizReussis(): ?int { return $this->quizReussis; }
    public function setQuizReussis(int $q): self { $this->quizReussis = $q; return $this; }
    public function getDerniereActivite(): ?\DateTimeInterface { return $this->derniereActivite; }
    public function setDerniereActivite(\DateTimeInterface $d): self { $this->derniereActivite = $d; return $this; }
}