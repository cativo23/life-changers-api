/*
  Warnings:

  - You are about to drop the `AccessToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccessToken` DROP FOREIGN KEY `AccessToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_access_token_id_fkey`;

-- DropTable
DROP TABLE `AccessToken`;

-- DropTable
DROP TABLE `RefreshToken`;

-- CreateTable
CREATE TABLE `access_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `hashed_token` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `access_tokens_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `hashed_token` VARCHAR(100) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `access_token_id` INTEGER NOT NULL,

    UNIQUE INDEX `refresh_tokens_id_key`(`id`),
    UNIQUE INDEX `refresh_tokens_access_token_id_key`(`access_token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `access_tokens` ADD CONSTRAINT `access_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_access_token_id_fkey` FOREIGN KEY (`access_token_id`) REFERENCES `access_tokens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
