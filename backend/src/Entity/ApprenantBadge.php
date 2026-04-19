<?php
// src/Entity/ApprenantBadge.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Apprenant;
use App\Entity\Badge;

#[ORM\Entity]
#[ApiResource]
class ApprenantBadge
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity:Apprenant::class, inversedBy:"badges")]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Apprenant $apprenant = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity:Badge::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Badge $badge = null;

    #[ORM\Column(type:"datetime")]
    private ?\DateTimeInterface $dateObtention = null;

    public function __construct(){ $this->dateObtention = new \DateTime(); }

    // Getters & Setters ...
    public function getApprenant(): ?Apprenant { return $this->apprenant; }
    public function setApprenant(Apprenant $a): self { $this->apprenant = $a; return $this; }
    public function getBadge(): ?Badge { return $this->badge; }
    public function setBadge(Badge $b): self { $this->badge = $b; return $this; }
    public function getDateObtention(): ?\DateTimeInterface { return $this->dateObtention; }
    public function setDateObtention(\DateTimeInterface $d): self { $this->dateObtention = $d; return $this; }
}