<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260403203321 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE apprenant DROP FOREIGN KEY `FK_C4EB462EFB88E14F`');
        $this->addSql('ALTER TABLE apprenant DROP FOREIGN KEY `FK_C4EB462EA76ED395`');
        $this->addSql('DROP INDEX UNIQ_C4EB462EA76ED395 ON apprenant');
        $this->addSql('ALTER TABLE apprenant DROP yes, DROP user_id, CHANGE utilisateur_id utilisateur_id INT NOT NULL');
        $this->addSql('ALTER TABLE apprenant ADD CONSTRAINT FK_C4EB462EFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE utilisateur ADD role VARCHAR(10) NOT NULL, ADD date_creation DATETIME NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1D1C63B3E7927C74 ON utilisateur (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE apprenant DROP FOREIGN KEY FK_C4EB462EFB88E14F');
        $this->addSql('ALTER TABLE apprenant ADD yes VARCHAR(255) DEFAULT NULL, ADD user_id INT NOT NULL, CHANGE utilisateur_id utilisateur_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE apprenant ADD CONSTRAINT `FK_C4EB462EFB88E14F` FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE apprenant ADD CONSTRAINT `FK_C4EB462EA76ED395` FOREIGN KEY (user_id) REFERENCES utilisateur (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C4EB462EA76ED395 ON apprenant (user_id)');
        $this->addSql('DROP INDEX UNIQ_1D1C63B3E7927C74 ON utilisateur');
        $this->addSql('ALTER TABLE utilisateur DROP role, DROP date_creation');
    }
}
