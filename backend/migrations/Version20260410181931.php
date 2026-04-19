<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260410181931 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE theme (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, image_url VARCHAR(255) DEFAULT NULL, date_creation DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE cours ADD theme_id INT NOT NULL, DROP theme');
        $this->addSql('ALTER TABLE cours ADD CONSTRAINT FK_FDCA8C9C59027487 FOREIGN KEY (theme_id) REFERENCES theme (id)');
        $this->addSql('CREATE INDEX IDX_FDCA8C9C59027487 ON cours (theme_id)');
        $this->addSql('ALTER TABLE lecon ADD duree INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE theme');
        $this->addSql('ALTER TABLE cours DROP FOREIGN KEY FK_FDCA8C9C59027487');
        $this->addSql('DROP INDEX IDX_FDCA8C9C59027487 ON cours');
        $this->addSql('ALTER TABLE cours ADD theme VARCHAR(100) DEFAULT NULL, DROP theme_id');
        $this->addSql('ALTER TABLE lecon DROP duree');
    }
}
