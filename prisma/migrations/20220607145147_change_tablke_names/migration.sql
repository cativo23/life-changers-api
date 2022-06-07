/*
  Warnings:

  - You are about to drop the `IdDocumentImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LandingImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaxDocumentImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email-change` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email-verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password-reset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `IdDocumentImage` DROP FOREIGN KEY `IdDocumentImage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TaxDocumentImage` DROP FOREIGN KEY `TaxDocumentImage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `email-change` DROP FOREIGN KEY `email-change_userId_fkey`;

-- DropForeignKey
ALTER TABLE `email-verification` DROP FOREIGN KEY `email-verification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `password-reset` DROP FOREIGN KEY `password-reset_userId_fkey`;

-- DropTable
DROP TABLE `IdDocumentImage`;

-- DropTable
DROP TABLE `LandingImages`;

-- DropTable
DROP TABLE `TaxDocumentImage`;

-- DropTable
DROP TABLE `email-change`;

-- DropTable
DROP TABLE `email-verification`;

-- DropTable
DROP TABLE `password-reset`;

-- CreateTable
CREATE TABLE `email_change_tokens` (
    `token` CHAR(21) NOT NULL,
    `newEmail` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `validUntil` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `email_change_tokens_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_verification_tokens` (
    `token` CHAR(21) NOT NULL,
    `userId` INTEGER NOT NULL,
    `validUntil` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `email_verification_tokens_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `token` CHAR(21) NOT NULL,
    `userId` INTEGER NOT NULL,
    `validUntil` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `password_reset_tokens_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `id_document_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `front` VARCHAR(191) NOT NULL,
    `back` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `id_document_images_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax_document_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `front` VARCHAR(191) NOT NULL,
    `back` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `tax_document_images_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `landing_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `alt_name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email_change_tokens` ADD CONSTRAINT `email_change_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `id_document_images` ADD CONSTRAINT `id_document_images_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tax_document_images` ADD CONSTRAINT `tax_document_images_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
