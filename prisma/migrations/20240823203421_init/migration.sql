/*
  Warnings:

  - Added the required column `anio_mes` to the `consumoEnergia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `consumoenergia` ADD COLUMN `anio_mes` INTEGER NOT NULL;
