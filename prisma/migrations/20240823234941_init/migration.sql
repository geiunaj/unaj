-- CreateTable
CREATE TABLE `Access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_user_id` INTEGER NOT NULL,

    INDEX `Access_type_user_id_idx`(`type_user_id`),
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
    `sede_id` INTEGER NULL,

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
    `valorCalorico` FLOAT NOT NULL,
    `factorEmisionCO2` FLOAT NOT NULL,
    `factorEmisionCH4` FLOAT NOT NULL,
    `factorEmisionN2O` FLOAT NOT NULL,
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
    `anio_mes` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `contenido` LONGBLOB NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoFertilizante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clase` VARCHAR(45) NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `porcentajeNitrogeno` FLOAT NOT NULL,
    `unidad` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fertilizante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoFertilizante_id` INTEGER NOT NULL,
    `cantidad` FLOAT NOT NULL,
    `is_ficha` BOOLEAN NOT NULL DEFAULT false,
    `ficha_id` INTEGER NULL,
    `sede_id` INTEGER NULL,
    `anio_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Fertilizante_ficha_id_key`(`ficha_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPapel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `gramaje` FLOAT NOT NULL,
    `unidad_paquete` VARCHAR(45) NOT NULL,
    `is_certificado` BOOLEAN NOT NULL DEFAULT false,
    `is_reciclable` BOOLEAN NOT NULL DEFAULT false,
    `porcentaje_reciclado` FLOAT NULL,
    `nombre_certificado` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsumoPapel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoPapel_id` INTEGER NOT NULL,
    `cantidad_paquete` INTEGER NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `anio_id` INTEGER NOT NULL,
    `sede_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GWP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `formula` VARCHAR(45) NOT NULL,
    `valor` FLOAT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combustibleCalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(45) NOT NULL,
    `tipoCombustibleId` INTEGER NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `valorCalorico` FLOAT NOT NULL,
    `consumo` FLOAT NOT NULL,
    `emisionCO2` FLOAT NOT NULL,
    `emisionCH4` FLOAT NOT NULL,
    `emisionN2O` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `anioId` INTEGER NOT NULL,
    `sedeId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fertilizanteCalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipofertilizanteId` INTEGER NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `cantidadAporte` FLOAT NOT NULL,
    `emisionDirecta` FLOAT NOT NULL,
    `totalEmisionesDirectas` FLOAT NOT NULL,
    `emisionGEI` FLOAT NULL,
    `anioId` INTEGER NOT NULL,
    `sedeId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumoEnergia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `areaId` INTEGER NOT NULL,
    `numeroSuministro` VARCHAR(45) NOT NULL,
    `consumo` FLOAT NOT NULL,
    `mes_id` INTEGER NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `anio_mes` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `sede_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `energiaCalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumoArea` FLOAT NOT NULL,
    `factorConversion` FLOAT NOT NULL,
    `factorId` INTEGER NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `emisionCO2` FLOAT NOT NULL,
    `emisionCH4` FLOAT NOT NULL,
    `emisionN2O` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `anioId` INTEGER NOT NULL,
    `areaId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factorConversionSEIN` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `factorCO2` FLOAT NOT NULL,
    `factorCH4` FLOAT NOT NULL,
    `factorN2O` FLOAT NOT NULL,
    `anioId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `factorConversionSEIN_anioId_key`(`anioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Taxi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidadContratante` VARCHAR(191) NOT NULL,
    `lugarSalida` VARCHAR(191) NOT NULL,
    `lugarDestino` VARCHAR(191) NOT NULL,
    `montoGastado` DOUBLE NOT NULL,
    `sede_id` INTEGER NOT NULL,
    `mes_id` INTEGER NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `anio_mes` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsumoAgua` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumo` FLOAT NOT NULL,
    `codigoMedidor` VARCHAR(45) NULL,
    `fuenteAgua` VARCHAR(45) NOT NULL,
    `area_id` INTEGER NULL,
    `mes_id` INTEGER NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `anio_mes` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Access` ADD CONSTRAINT `Access_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `TypeUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `TypeUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_tipoCombustible_id_fkey` FOREIGN KEY (`tipoCombustible_id`) REFERENCES `tipoCombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `Mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Combustible` ADD CONSTRAINT `Combustible_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_tipoFertilizante_id_fkey` FOREIGN KEY (`tipoFertilizante_id`) REFERENCES `TipoFertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_ficha_id_fkey` FOREIGN KEY (`ficha_id`) REFERENCES `Documento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fertilizante` ADD CONSTRAINT `Fertilizante_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsumoPapel` ADD CONSTRAINT `ConsumoPapel_tipoPapel_id_fkey` FOREIGN KEY (`tipoPapel_id`) REFERENCES `TipoPapel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsumoPapel` ADD CONSTRAINT `ConsumoPapel_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsumoPapel` ADD CONSTRAINT `ConsumoPapel_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustibleCalculos` ADD CONSTRAINT `combustibleCalculos_tipoCombustibleId_fkey` FOREIGN KEY (`tipoCombustibleId`) REFERENCES `tipoCombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustibleCalculos` ADD CONSTRAINT `combustibleCalculos_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustibleCalculos` ADD CONSTRAINT `combustibleCalculos_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizanteCalculos` ADD CONSTRAINT `fertilizanteCalculos_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizanteCalculos` ADD CONSTRAINT `fertilizanteCalculos_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizanteCalculos` ADD CONSTRAINT `fertilizanteCalculos_tipofertilizanteId_fkey` FOREIGN KEY (`tipofertilizanteId`) REFERENCES `TipoFertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoEnergia` ADD CONSTRAINT `consumoEnergia_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `Mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoEnergia` ADD CONSTRAINT `consumoEnergia_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoEnergia` ADD CONSTRAINT `consumoEnergia_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `area` ADD CONSTRAINT `area_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiaCalculos` ADD CONSTRAINT `energiaCalculos_factorId_fkey` FOREIGN KEY (`factorId`) REFERENCES `factorConversionSEIN`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiaCalculos` ADD CONSTRAINT `energiaCalculos_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiaCalculos` ADD CONSTRAINT `energiaCalculos_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factorConversionSEIN` ADD CONSTRAINT `factorConversionSEIN_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Taxi` ADD CONSTRAINT `Taxi_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `Mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Taxi` ADD CONSTRAINT `Taxi_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Taxi` ADD CONSTRAINT `Taxi_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsumoAgua` ADD CONSTRAINT `ConsumoAgua_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `Anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsumoAgua` ADD CONSTRAINT `ConsumoAgua_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `Mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConsumoAgua` ADD CONSTRAINT `ConsumoAgua_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
