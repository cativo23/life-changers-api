-- AlterTable
ALTER TABLE `id_document_images` ADD COLUMN `valid` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `tax_document_images` ADD COLUMN `valid` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `documentsValid` BOOLEAN NOT NULL DEFAULT false;
