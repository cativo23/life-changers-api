-- CreateTable
CREATE TABLE `email-change` (
    `token` CHAR(21) NOT NULL,
    `newEmail` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `validUntil` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `email-change_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email-verification` (
    `token` CHAR(21) NOT NULL,
    `userId` INTEGER NOT NULL,
    `validUntil` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `email-verification_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password-reset` (
    `token` CHAR(21) NOT NULL,
    `userId` INTEGER NOT NULL,
    `validUntil` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `password-reset_userId_key`(`userId`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email-change` ADD CONSTRAINT `email-change_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email-verification` ADD CONSTRAINT `email-verification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password-reset` ADD CONSTRAINT `password-reset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
