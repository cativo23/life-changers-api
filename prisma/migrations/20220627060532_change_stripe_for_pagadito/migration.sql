/*
  Warnings:

  - You are about to drop the column `stripe_costumer_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `stripe_costumer_id`,
    ADD COLUMN `pagadito_costumer_id` VARCHAR(191) NULL;
