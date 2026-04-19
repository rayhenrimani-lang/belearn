<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260403202709 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE administrateur (utilisateur_id INT NOT NULL, PRIMARY KEY (utilisateur_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE apprenant_badge (date_obtention DATETIME NOT NULL, apprenant_id INT NOT NULL, badge_id INT NOT NULL, INDEX IDX_905958BC5697D6D (apprenant_id), INDEX IDX_905958BF7A2C2FC (badge_id), PRIMARY KEY (apprenant_id, badge_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE badge (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE inscription (id INT AUTO_INCREMENT NOT NULL, date_inscription DATE NOT NULL, statut VARCHAR(12) NOT NULL, apprenant_id INT NOT NULL, cours_id INT NOT NULL, INDEX IDX_5E90F6D6C5697D6D (apprenant_id), INDEX IDX_5E90F6D67ECF78B0 (cours_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE lecon (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, type VARCHAR(10) NOT NULL, contenu LONGTEXT DEFAULT NULL, url_video VARCHAR(255) DEFAULT NULL, ordre INT DEFAULT NULL, cours_id INT NOT NULL, INDEX IDX_94E6242E7ECF78B0 (cours_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE progression (pourcentage DOUBLE PRECISION NOT NULL, lecons_terminees INT NOT NULL, quiz_reussis INT NOT NULL, derniere_activite DATETIME NOT NULL, apprenant_id INT NOT NULL, PRIMARY KEY (apprenant_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE quiz (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, type VARCHAR(10) NOT NULL, date_creation DATETIME NOT NULL, cours_id INT NOT NULL, INDEX IDX_A412FA927ECF78B0 (cours_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE tentative_quiz (id INT AUTO_INCREMENT NOT NULL, score DOUBLE PRECISION DEFAULT NULL, date_tentative DATETIME NOT NULL, duree INT DEFAULT NULL, quiz_id INT NOT NULL, apprenant_id INT NOT NULL, INDEX IDX_A66F2D8853CD175 (quiz_id), INDEX IDX_A66F2D8C5697D6D (apprenant_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE administrateur ADD CONSTRAINT FK_32EB52E8FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE apprenant_badge ADD CONSTRAINT FK_905958BC5697D6D FOREIGN KEY (apprenant_id) REFERENCES apprenant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE apprenant_badge ADD CONSTRAINT FK_905958BF7A2C2FC FOREIGN KEY (badge_id) REFERENCES badge (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inscription ADD CONSTRAINT FK_5E90F6D6C5697D6D FOREIGN KEY (apprenant_id) REFERENCES apprenant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inscription ADD CONSTRAINT FK_5E90F6D67ECF78B0 FOREIGN KEY (cours_id) REFERENCES cours (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE lecon ADD CONSTRAINT FK_94E6242E7ECF78B0 FOREIGN KEY (cours_id) REFERENCES cours (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE progression ADD CONSTRAINT FK_D5B25073C5697D6D FOREIGN KEY (apprenant_id) REFERENCES apprenant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE quiz ADD CONSTRAINT FK_A412FA927ECF78B0 FOREIGN KEY (cours_id) REFERENCES cours (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tentative_quiz ADD CONSTRAINT FK_A66F2D8853CD175 FOREIGN KEY (quiz_id) REFERENCES quiz (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tentative_quiz ADD CONSTRAINT FK_A66F2D8C5697D6D FOREIGN KEY (apprenant_id) REFERENCES apprenant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE cours ADD date_creation DATETIME NOT NULL, ADD statut VARCHAR(10) NOT NULL, CHANGE theme theme VARCHAR(100) DEFAULT NULL, CHANGE description description LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE administrateur DROP FOREIGN KEY FK_32EB52E8FB88E14F');
        $this->addSql('ALTER TABLE apprenant_badge DROP FOREIGN KEY FK_905958BC5697D6D');
        $this->addSql('ALTER TABLE apprenant_badge DROP FOREIGN KEY FK_905958BF7A2C2FC');
        $this->addSql('ALTER TABLE inscription DROP FOREIGN KEY FK_5E90F6D6C5697D6D');
        $this->addSql('ALTER TABLE inscription DROP FOREIGN KEY FK_5E90F6D67ECF78B0');
        $this->addSql('ALTER TABLE lecon DROP FOREIGN KEY FK_94E6242E7ECF78B0');
        $this->addSql('ALTER TABLE progression DROP FOREIGN KEY FK_D5B25073C5697D6D');
        $this->addSql('ALTER TABLE quiz DROP FOREIGN KEY FK_A412FA927ECF78B0');
        $this->addSql('ALTER TABLE tentative_quiz DROP FOREIGN KEY FK_A66F2D8853CD175');
        $this->addSql('ALTER TABLE tentative_quiz DROP FOREIGN KEY FK_A66F2D8C5697D6D');
        $this->addSql('DROP TABLE administrateur');
        $this->addSql('DROP TABLE apprenant_badge');
        $this->addSql('DROP TABLE badge');
        $this->addSql('DROP TABLE inscription');
        $this->addSql('DROP TABLE lecon');
        $this->addSql('DROP TABLE progression');
        $this->addSql('DROP TABLE quiz');
        $this->addSql('DROP TABLE tentative_quiz');
        $this->addSql('ALTER TABLE cours DROP date_creation, DROP statut, CHANGE theme theme VARCHAR(100) NOT NULL, CHANGE description description VARCHAR(255) NOT NULL');
    }
}
