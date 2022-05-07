/*
  Warnings:

  - Added the required column `description` to the `institutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_students` to the `institutions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `institutions` ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `number_students` INTEGER NOT NULL;
