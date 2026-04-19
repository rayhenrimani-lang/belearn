<?php

namespace App\Controller;

use App\Entity\Cours;
use App\Entity\Lecon;
use App\Entity\Quiz;
use Doctrine\ORM\EntityManagerInterface;

use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;

use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/formateur', routeName: 'formateur')]
class FormateurDashboardController extends AbstractDashboardController
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function index(): Response
    {
        $user = $this->getUser();

        $cours = $this->em->getRepository(Cours::class)->count([
            'formateur' => $user
        ]);

        $lecons = $this->em->getRepository(Lecon::class)->count([]);

        $quiz = $this->em->getRepository(Quiz::class)->count([]);

        return $this->render('formateur/dashboard.html.twig', [
            'cours' => $cours,
            'lecons' => $lecons,
            'quiz' => $quiz
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Formateur Dashboard');
    }
}