<?php

namespace App\Controller\Admin;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use App\Entity\Utilisateur;
use App\Entity\Cours;
use App\Entity\Lecon;
use App\Entity\Quiz;
use App\Entity\Theme;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use App\Controller\Admin\UtilisateurCrudController;
#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class AdminDashboardController extends AbstractDashboardController
{
    public function index(): Response
{
    $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);

    return $this->redirect(
        $adminUrlGenerator->setController(UtilisateurCrudController::class)->generateUrl()
    );
}
    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('MicroLearning Admin');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');

        yield MenuItem::section('Users');
        yield MenuItem::linkToRoute('Utilisateurs', 'fas fa-users', 'admin');
        
        yield MenuItem::section('Learning');
        
        yield MenuItem::linkToRoute('Themes', 'fas fa-layer-group', 'admin');
        yield MenuItem::linkToRoute('Cours', 'fas fa-book', 'admin');
        yield MenuItem::linkToRoute('Lecons', 'fas fa-video', 'admin');
        yield MenuItem::linkToRoute('Quiz', 'fas fa-question-circle', 'admin');
    }
    
}