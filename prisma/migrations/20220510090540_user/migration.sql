-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `image` VARCHAR(191) NULL;
