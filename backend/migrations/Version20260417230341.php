<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260417230341 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cours DROP formateur_id, CHANGE theme_id theme_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE utilisateur ADD is_verified TINYINT NOT NULL, CHANGE roles roles VARCHAR(20) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cours ADD formateur_id INT DEFAULT NULL, CHANGE theme_id theme_id INT NOT NULL');
        $this->addSql('ALTER TABLE utilisateur DROP is_verified, CHANGE roles roles VARCHAR(10) NOT NULL');
    }
}
