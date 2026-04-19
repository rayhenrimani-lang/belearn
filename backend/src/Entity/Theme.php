<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ThemeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ThemeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['theme:read']]
)]
class Theme
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['theme:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['theme:read', 'course:read'])]
    private ?string $nom = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['theme:read', 'course:read'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['theme:read', 'course:read'])]
    private ?string $imageUrl = null;

    #[ORM\Column]
    #[Groups(['theme:read'])]
    private ?\DateTimeImmutable $dateCreation = null;

    #[ORM\OneToMany(mappedBy: 'theme', targetEntity: Cours::class)]
    #[Groups(['theme:read'])]
    private Collection $cours;

    public function __construct()
    {
        $this->cours = new ArrayCollection();
        $this->dateCreation = new \DateTimeImmutable();
    }

    // ✅ GETTERS / SETTERS

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;
        return $this;
    }

    public function getDateCreation(): ?\DateTimeImmutable
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeImmutable $dateCreation): static
    {
        $this->dateCreation = $dateCreation;
        return $this;
    }

    /**
     * @return Collection<int, Cours>
     */
    public function getCours(): Collection
    {
        return $this->cours;
    }

    public function addCours(Cours $cours): static
    {
        if (!$this->cours->contains($cours)) {
            $this->cours->add($cours);
            $cours->setTheme($this);
        }
        return $this;
    }

    public function removeCours(Cours $cours): static
    {
        if ($this->cours->removeElement($cours)) {
            if ($cours->getTheme() === $this) {
                $cours->setTheme(null);
            }
        }
        return $this;
    }
}