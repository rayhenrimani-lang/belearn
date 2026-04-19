<?php
// src/Entity/Inscription.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Apprenant;
use App\Entity\Cours;

#[ORM\Entity]
#[ApiResource]
class Inscription
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity:Apprenant::class, inversedBy:"inscriptions")]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Apprenant $apprenant = null;

    #[ORM\ManyToOne(targetEntity:Cours::class, inversedBy:"inscriptions")]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private ?Cours $cours = null;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $dateInscription = null;

    #[ORM\Column(type:"string", length:12)]
    private ?string $statut = 'EN_ATTENTE';

    public const STATUTS = ['EN_ATTENTE','ACCEPTE'];

    public function __construct(){ $this->dateInscription = new \DateTime(); }

    // Getters & Setters ...
    public function getId(): ?int { return $this->id; }
    public function getApprenant(): ?Apprenant { return $this->apprenant; }
    public function setApprenant(Apprenant $a): self { $this->apprenant = $a; return $this; }
    public function getCours(): ?Cours { return $this->cours; }
    public function setCours(Cours $c): self { $this->cours = $c; return $this; }
    public function getDateInscription(): ?\DateTimeInterface { return $this->dateInscription; }
    public function setDateInscription(\DateTimeInterface $d): self { $this->dateInscription = $d; return $this; }
    public function getStatut(): ?string { return $this->statut; }
    public function setStatut(string $s): self { 
        if(!in_array($s,self::STATUTS)) throw new \InvalidArgumentException("Statut invalide"); 
        $this->statut = $s; return $this;
    }
}