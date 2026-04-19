-- Sample data for MicroLearn application
-- Run this in your phpMyAdmin or MySQL client

-- Insert Themes
INSERT INTO theme (nom, description, image_url, date_creation) VALUES
('Développement Web', 'Apprenez HTML, CSS, JavaScript et les frameworks modernes', 'https://picsum.photos/300/200?random=1', NOW()),
('Mobile Development', 'Créez des applications iOS et Android natives', 'https://picsum.photos/300/200?random=2', NOW()),
('Design UI/UX', 'Principes de design et expérience utilisateur', 'https://picsum.photos/300/200?random=3', NOW());

-- Get the inserted theme IDs
SET @theme1_id = 1;
SET @theme2_id = 2;
SET @theme3_id = 3;

-- Insert Courses
INSERT INTO cours (titre, description, date_creation, statut, theme_id) VALUES
('HTML & CSS Fundamentals', 'Apprenez les bases du HTML et CSS pour créer des sites web modernes', NOW(), 'PUBLIE', @theme1_id),
('JavaScript Advanced', 'Maîtrisez JavaScript avancé, ES6+ et les concepts modernes', NOW(), 'PUBLIE', @theme1_id),
('React Native Basics', 'Créez des applications mobiles avec React Native', NOW(), 'PUBLIE', @theme2_id),
('UI Design Principles', 'Apprenez les principes fondamentaux du design d''interface', NOW(), 'PUBLIE', @theme3_id);

-- Get the inserted course IDs
SET @course1_id = 1;
SET @course2_id = 2;
SET @course3_id = 3;
SET @course4_id = 4;

-- Insert Lessons
INSERT INTO lecon (titre, type, contenu, url_video, ordre, duree, cours_id) VALUES
-- Lessons for Course 1 (HTML & CSS Fundamentals)
('Introduction au HTML', 'VIDEO', 'Découvrez les bases du HTML5 et la structure des pages web', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 1, 15, @course1_id),
('Les balises essentielles', 'VIDEO', 'Apprenez les balises HTML les plus importantes', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 2, 20, @course1_id),
('CSS - Sélecteurs et propriétés', 'VIDEO', 'Maîtrisez les sélecteurs CSS et les propriétés de base', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 3, 25, @course1_id),

-- Lessons for Course 2 (JavaScript Advanced)
('JavaScript - Variables et types', 'VIDEO', 'Comprendre les variables, types et portée en JavaScript', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 1, 18, @course2_id),
('Fonctions et portée', 'VIDEO', 'Les fonctions JavaScript et la portée des variables', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 2, 22, @course2_id),

-- Lessons for Course 3 (React Native Basics)
('Setup de l''environnement', 'VIDEO', 'Installation de Node.js, React Native CLI et configuration', 'https://www.youtube.com/watch?v=0-S5J0v5h4', 1, 30, @course3_id),

-- Lessons for Course 4 (UI Design Principles)
('Principes de base du design', 'TEXTE', 'Les fondamentaux du design: équilibre, contraste, hiérarchie', NULL, 1, 45, @course4_id);

-- Verify data insertion
SELECT 
    'Themes' as table_name, 
    COUNT(*) as count 
FROM theme
UNION ALL SELECT 
    'Courses' as table_name, 
    COUNT(*) as count 
FROM cours
UNION ALL SELECT 
    'Lessons' as table_name, 
    COUNT(*) as count 
FROM lecon;
