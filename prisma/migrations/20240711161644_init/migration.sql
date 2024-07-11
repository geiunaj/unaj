-- CreateTable
CREATE TABLE `Option` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Option_field_id_idx`(`field_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Field` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `placeholder` VARCHAR(255) NOT NULL,
    `required` BOOLEAN NOT NULL,
    `is_calculated` BOOLEAN NOT NULL,
    `formula` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Field_form_id_idx`(`form_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Form` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_user_id` INTEGER NOT NULL,
    `forms_id` INTEGER NOT NULL,

    INDEX `Access_type_user_id_idx`(`type_user_id`),
    INDEX `Access_forms_id_idx`(`forms_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(45) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `type_user_id` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_type_user_id_idx`(`type_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sede` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipoCombustible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `abreviatura` VARCHAR(45) NOT NULL,
    `unidad` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Combustible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(45) NOT NULL,
    `tipoEquipo` VARCHAR(45) NOT NULL,
    `consumo` FLOAT NOT NULL,
    `tipoCombustible_id` INTEGER NOT NULL,
    `mes_id` INTEGER NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `sede_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `Form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `TypeUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_forms_id_fkey` FOREIGN KEY (`forms_id`) REFERENCES `Form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `TypeUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_tipoCombustible_id_fkey` FOREIGN KEY (`tipoCombustible_id`) REFERENCES `tipoCombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `Mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
