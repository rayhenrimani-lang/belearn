<?php

namespace App\DataFixtures;

use App\Entity\Theme;
use App\Entity\Cours;
use App\Entity\Lecon;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Create Themes
        $theme1 = new Theme();
        $theme1->setNom('Développement Web');
        $theme1->setDescription('Apprenez HTML, CSS, JavaScript et les frameworks modernes');
        $theme1->setImageUrl('https://via.placeholder.com/300x200/6B46C1/FFFFFF?text=Web');
        $theme1->setDateCreation(new \DateTimeImmutable('-30 days'));

        $theme2 = new Theme();
        $theme2->setNom('Mobile Development');
        $theme2->setDescription('Créez des applications iOS et Android natives');
        $theme2->setImageUrl('https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Mobile');
        $theme2->setDateCreation(new \DateTimeImmutable('-25 days'));

        $theme3 = new Theme();
        $theme3->setNom('Design UI/UX');
        $theme3->setDescription('Principes de design et expérience utilisateur');
        $theme3->setImageUrl('https://via.placeholder.com/300x200/10B981/FFFFFF?text=Design');
        $theme3->setDateCreation(new \DateTimeImmutable('-20 days'));

        $manager->persist($theme1);
        $manager->persist($theme2);
        $manager->persist($theme3);

        // Create Courses for Theme 1 (Web Development)
        $course1 = new Cours();
        $course1->setTitre('HTML & CSS Fundamentals');
        $course1->setDescription('Apprenez les bases du HTML et CSS pour créer des sites web modernes');
        $course1->setStatut('PUBLIE');
        $course1->setTheme($theme1);
        $course1->setDateCreation(new \DateTimeImmutable('-15 days'));

        $course2 = new Cours();
        $course2->setTitre('JavaScript Advanced');
        $course2->setDescription('Maîtrisez JavaScript avancé, ES6+ et les concepts modernes');
        $course2->setStatut('PUBLIE');
        $course2->setTheme($theme1);
        $course2->setDateCreation(new \DateTimeImmutable('-10 days'));

        // Create Courses for Theme 2 (Mobile Development)
        $course3 = new Cours();
        $course3->setTitre('React Native Basics');
        $course3->setDescription('Créez des applications mobiles avec React Native');
        $course3->setStatut('PUBLIE');
        $course3->setTheme($theme2);
        $course3->setDateCreation(new \DateTimeImmutable('-8 days'));

        // Create Courses for Theme 3 (Design)
        $course4 = new Cours();
        $course4->setTitre('UI Design Principles');
        $course4->setDescription('Apprenez les principes fondamentaux du design dinterface');
        $course4->setStatut('PUBLIE');
        $course4->setTheme($theme3);
        $course4->setDateCreation(new \DateTimeImmutable('-5 days'));

        $manager->persist($course1);
        $manager->persist($course2);
        $manager->persist($course3);
        $manager->persist($course4);

        // Create Lessons for Course 1 (HTML & CSS)
        $lesson1 = new Lecon();
        $lesson1->setTitre('Introduction au HTML');
        $lesson1->setType('VIDEO');
        $lesson1->setContenu('Découvrez les bases du HTML5 et la structure des pages web');
        $lesson1->setUrlVideo('https://www.youtube.com/watch?v=kUMe1FH4CHE');
        $lesson1->setOrdre(1);
        $lesson1->setDuree(15);
        $lesson1->setCours($course1);

        $lesson2 = new Lecon();
        $lesson2->setTitre('Les balises essentielles');
        $lesson2->setType('VIDEO');
        $lesson2->setContenu('Apprenez les balises HTML les plus importantes');
        $lesson2->setUrlVideo('https://www.youtube.com/watch?v=kUMe1FH4CHE');
        $lesson2->setOrdre(2);
        $lesson2->setDuree(20);
        $lesson2->setCours($course1);

        $lesson3 = new Lecon();
        $lesson3->setTitre('CSS - Sélecteurs et propriétés');
        $lesson3->setType('VIDEO');
        $lesson3->setContenu('Maîtrisez les sélecteurs CSS et les propriétés de base');
        $lesson3->setUrlVideo('https://www.youtube.com/watch?v=kUMe1FH4CHE');
        $lesson3->setOrdre(3);
        $lesson3->setDuree(25);
        $lesson3->setCours($course1);

        // Create Lessons for Course 2 (JavaScript)
        $lesson4 = new Lecon();
        $lesson4->setTitre('JavaScript - Variables et types');
        $lesson4->setType('VIDEO');
        $lesson4->setContenu('Comprendre les variables, types et portée en JavaScript');
        $lesson4->setUrlVideo('https://www.youtube.com/watch?v=W6NZfCO5SIk');
        $lesson4->setOrdre(1);
        $lesson4->setDuree(18);
        $lesson4->setCours($course2);

        $lesson5 = new Lecon();
        $lesson5->setTitre('Fonctions et portée');
        $lesson5->setType('VIDEO');
        $lesson5->setContenu('Les fonctions JavaScript et la portée des variables');
        $lesson5->setUrlVideo('https://www.youtube.com/watch?v=W6NZfCO5SIk');
        $lesson5->setOrdre(2);
        $lesson5->setDuree(22);
        $lesson5->setCours($course2);

        // Create Lessons for Course 3 (React Native)
        $lesson6 = new Lecon();
        $lesson6->setTitre('Setup de lenvironnement');
        $lesson6->setType('VIDEO');
        $lesson6->setContenu('Installation de Node.js, React Native CLI et configuration');
        $lesson6->setUrlVideo('https://www.youtube.com/watch?v=0-S5J0v5h4');
        $lesson6->setOrdre(1);
        $lesson6->setDuree(30);
        $lesson6->setCours($course3);

        // Create Lessons for Course 4 (UI Design)
        $lesson7 = new Lecon();
        $lesson7->setTitre('Principes de base du design');
        $lesson7->setType('TEXTE');
        $lesson7->setContenu('Les fondamentaux du design: équilibre, contraste, hiérarchie');
        $lesson7->setOrdre(1);
        $lesson7->setDuree(45);
        $lesson7->setCours($course4);

        $manager->persist($lesson1);
        $manager->persist($lesson2);
        $manager->persist($lesson3);
        $manager->persist($lesson4);
        $manager->persist($lesson5);
        $manager->persist($lesson6);
        $manager->persist($lesson7);

        $manager->flush();
    }
}
