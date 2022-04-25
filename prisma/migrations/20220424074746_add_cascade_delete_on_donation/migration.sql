-- DropForeignKey
ALTER TABLE `donations` DROP FOREIGN KEY `donations_userId_fkey`;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
