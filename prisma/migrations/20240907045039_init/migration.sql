-- CreateTable
CREATE TABLE `access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_user_id` INTEGER NOT NULL,

    INDEX `access_type_user_id_idx`(`type_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `typeuser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(45) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `type_user_id` INTEGER NOT NULL,
    `sede_id` INTEGER NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_type_user_id_idx`(`type_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sede` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipocombustiblefactor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valorCalorico` FLOAT NOT NULL,
    `factorEmisionCO2` FLOAT NOT NULL,
    `factorEmisionCH4` FLOAT NOT NULL,
    `factorEmisionN2O` FLOAT NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `tipoCombustible_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipocombustible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `abreviatura` VARCHAR(45) NOT NULL,
    `unidad` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combustible` (
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
CREATE TABLE `documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `contenido` LONGBLOB NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipofertilizante` (
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
CREATE TABLE `factoremisionfertilizante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` FLOAT NOT NULL,
    `anio_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fertilizante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoFertilizante_id` INTEGER NOT NULL,
    `cantidad` FLOAT NOT NULL,
    `is_ficha` BOOLEAN NOT NULL DEFAULT false,
    `ficha_id` INTEGER NULL,
    `sede_id` INTEGER NULL,
    `anio_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fertilizante_ficha_id_key`(`ficha_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipopapel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `largo` FLOAT NOT NULL,
    `ancho` FLOAT NOT NULL,
    `area` FLOAT NOT NULL,
    `gramaje` FLOAT NOT NULL,
    `unidad_paquete` VARCHAR(45) NOT NULL,
    `porcentaje_reciclado` FLOAT NULL,
    `porcentaje_virgen` FLOAT NULL,
    `nombre_certificado` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factortipopapel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoPapelId` INTEGER NOT NULL,
    `reciclado` FLOAT NOT NULL,
    `virgen` FLOAT NOT NULL,
    `anioId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumopapel` (
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
CREATE TABLE `consumopapelcalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoPapel_id` INTEGER NOT NULL,
    `cantidad` FLOAT NOT NULL,
    `consumo` FLOAT NOT NULL,
    `period_id` INTEGER NOT NULL,
    `sede_id` INTEGER NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumopapelcalculosdetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` FLOAT NOT NULL,
    `factorTipoPapelId` INTEGER NOT NULL,
    `consumo` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `consumoPapelCalculosId` INTEGER NOT NULL,
    `sedeId` INTEGER NOT NULL,
    `anioId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gwp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `formula` VARCHAR(45) NOT NULL,
    `valor` FLOAT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combustiblecalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(45) NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `consumo` FLOAT NOT NULL,
    `emisionCO2` FLOAT NOT NULL,
    `emisionCH4` FLOAT NOT NULL,
    `emisionN2O` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `sedeId` INTEGER NOT NULL,
    `periodoCalculoId` INTEGER NULL,
    `tipoCombustibleId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combustiblecalculosdetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(45) NOT NULL,
    `tipoCombustibleFactorId` INTEGER NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `valorCalorico` FLOAT NOT NULL,
    `consumo` FLOAT NOT NULL,
    `emisionCO2` FLOAT NOT NULL,
    `emisionCH4` FLOAT NOT NULL,
    `emisionN2O` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `sedeId` INTEGER NOT NULL,
    `combustibleCalculosId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fertilizantecalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipofertilizanteId` INTEGER NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `cantidadAporte` FLOAT NOT NULL,
    `emisionDirecta` FLOAT NOT NULL,
    `totalEmisionesDirectas` FLOAT NOT NULL,
    `emisionGEI` FLOAT NULL,
    `sedeId` INTEGER NOT NULL,
    `periodoCalculoId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fertilizantecalculosdetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipofertilizanteId` INTEGER NOT NULL,
    `factorEmisionId` INTEGER NOT NULL,
    `consumo` FLOAT NOT NULL,
    `cantidadAporte` FLOAT NOT NULL,
    `emisionDirecta` FLOAT NOT NULL,
    `totalEmisionesDirectas` FLOAT NOT NULL,
    `emisionGEI` FLOAT NOT NULL,
    `sedeId` INTEGER NOT NULL,
    `fertilizanteCalculosId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumoenergia` (
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
CREATE TABLE `energiacalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumoArea` FLOAT NOT NULL,
    `factorConversion` FLOAT NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `emisionCO2` FLOAT NOT NULL,
    `emisionCH4` FLOAT NOT NULL,
    `emisionN2O` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `areaId` INTEGER NOT NULL,
    `periodoCalculoId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `energiacalculosdetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumoArea` FLOAT NOT NULL,
    `factorConversion` FLOAT NOT NULL,
    `factorConversionSEINId` INTEGER NOT NULL,
    `consumoTotal` FLOAT NOT NULL,
    `emisionCO2` FLOAT NOT NULL,
    `emisionCH4` FLOAT NOT NULL,
    `emisionN2O` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `areaId` INTEGER NOT NULL,
    `energiaCalculosId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factorconversionsein` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `factorCO2` FLOAT NOT NULL,
    `factorCH4` FLOAT NOT NULL,
    `factorN2O` FLOAT NOT NULL,
    `anioId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `factorconversionsein_anioId_key`(`anioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taxi` (
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
CREATE TABLE `consumoagua` (
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

-- CreateTable
CREATE TABLE `factoremisionagua` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `factor` FLOAT NOT NULL,
    `anio_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumoaguacalculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumoArea` FLOAT NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `areaId` INTEGER NOT NULL,
    `periodoCalculoId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consumoaguacalculosdetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumoArea` FLOAT NOT NULL,
    `factorEmisionAguaId` INTEGER NOT NULL,
    `totalGEI` FLOAT NOT NULL,
    `areaId` INTEGER NOT NULL,
    `consumoAguaCalculosId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periodocalculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaInicio` VARCHAR(191) NULL,
    `fechaFin` VARCHAR(191) NULL,
    `yearInicio` VARCHAR(191) NULL,
    `yearFin` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `access` ADD CONSTRAINT `access_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `typeuser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_type_user_id_fkey` FOREIGN KEY (`type_user_id`) REFERENCES `typeuser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tipocombustiblefactor` ADD CONSTRAINT `tipocombustiblefactor_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tipocombustiblefactor` ADD CONSTRAINT `tipocombustiblefactor_tipoCombustible_id_fkey` FOREIGN KEY (`tipoCombustible_id`) REFERENCES `tipocombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustible` ADD CONSTRAINT `combustible_tipoCombustible_id_fkey` FOREIGN KEY (`tipoCombustible_id`) REFERENCES `tipocombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustible` ADD CONSTRAINT `combustible_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustible` ADD CONSTRAINT `combustible_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustible` ADD CONSTRAINT `combustible_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factoremisionfertilizante` ADD CONSTRAINT `factoremisionfertilizante_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizante` ADD CONSTRAINT `fertilizante_tipoFertilizante_id_fkey` FOREIGN KEY (`tipoFertilizante_id`) REFERENCES `tipofertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizante` ADD CONSTRAINT `fertilizante_ficha_id_fkey` FOREIGN KEY (`ficha_id`) REFERENCES `documento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizante` ADD CONSTRAINT `fertilizante_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizante` ADD CONSTRAINT `fertilizante_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factortipopapel` ADD CONSTRAINT `factortipopapel_tipoPapelId_fkey` FOREIGN KEY (`tipoPapelId`) REFERENCES `tipopapel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factortipopapel` ADD CONSTRAINT `factortipopapel_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapel` ADD CONSTRAINT `consumopapel_tipoPapel_id_fkey` FOREIGN KEY (`tipoPapel_id`) REFERENCES `tipopapel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapel` ADD CONSTRAINT `consumopapel_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapel` ADD CONSTRAINT `consumopapel_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculos` ADD CONSTRAINT `consumopapelcalculos_tipoPapel_id_fkey` FOREIGN KEY (`tipoPapel_id`) REFERENCES `tipopapel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculos` ADD CONSTRAINT `consumopapelcalculos_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculos` ADD CONSTRAINT `consumopapelcalculos_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `periodocalculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculosdetail` ADD CONSTRAINT `consumopapelcalculosdetail_factorTipoPapelId_fkey` FOREIGN KEY (`factorTipoPapelId`) REFERENCES `factortipopapel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculosdetail` ADD CONSTRAINT `consumopapelcalculosdetail_consumoPapelCalculosId_fkey` FOREIGN KEY (`consumoPapelCalculosId`) REFERENCES `consumopapelcalculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculosdetail` ADD CONSTRAINT `consumopapelcalculosdetail_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumopapelcalculosdetail` ADD CONSTRAINT `consumopapelcalculosdetail_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustiblecalculos` ADD CONSTRAINT `combustiblecalculos_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustiblecalculos` ADD CONSTRAINT `combustiblecalculos_periodoCalculoId_fkey` FOREIGN KEY (`periodoCalculoId`) REFERENCES `periodocalculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustiblecalculos` ADD CONSTRAINT `combustiblecalculos_tipoCombustibleId_fkey` FOREIGN KEY (`tipoCombustibleId`) REFERENCES `tipocombustible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustiblecalculosdetail` ADD CONSTRAINT `combustiblecalculosdetail_tipoCombustibleFactorId_fkey` FOREIGN KEY (`tipoCombustibleFactorId`) REFERENCES `tipocombustiblefactor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustiblecalculosdetail` ADD CONSTRAINT `combustiblecalculosdetail_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combustiblecalculosdetail` ADD CONSTRAINT `combustiblecalculosdetail_combustibleCalculosId_fkey` FOREIGN KEY (`combustibleCalculosId`) REFERENCES `combustiblecalculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculos` ADD CONSTRAINT `fertilizantecalculos_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculos` ADD CONSTRAINT `fertilizantecalculos_periodoCalculoId_fkey` FOREIGN KEY (`periodoCalculoId`) REFERENCES `periodocalculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculos` ADD CONSTRAINT `fertilizantecalculos_tipofertilizanteId_fkey` FOREIGN KEY (`tipofertilizanteId`) REFERENCES `tipofertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculosdetail` ADD CONSTRAINT `fertilizantecalculosdetail_tipofertilizanteId_fkey` FOREIGN KEY (`tipofertilizanteId`) REFERENCES `tipofertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculosdetail` ADD CONSTRAINT `fertilizantecalculosdetail_factorEmisionId_fkey` FOREIGN KEY (`factorEmisionId`) REFERENCES `factoremisionfertilizante`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculosdetail` ADD CONSTRAINT `fertilizantecalculosdetail_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fertilizantecalculosdetail` ADD CONSTRAINT `fertilizantecalculosdetail_fertilizanteCalculosId_fkey` FOREIGN KEY (`fertilizanteCalculosId`) REFERENCES `fertilizantecalculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoenergia` ADD CONSTRAINT `consumoenergia_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoenergia` ADD CONSTRAINT `consumoenergia_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoenergia` ADD CONSTRAINT `consumoenergia_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `area` ADD CONSTRAINT `area_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiacalculos` ADD CONSTRAINT `energiacalculos_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiacalculos` ADD CONSTRAINT `energiacalculos_periodoCalculoId_fkey` FOREIGN KEY (`periodoCalculoId`) REFERENCES `periodocalculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiacalculosdetail` ADD CONSTRAINT `energiacalculosdetail_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiacalculosdetail` ADD CONSTRAINT `energiacalculosdetail_energiaCalculosId_fkey` FOREIGN KEY (`energiaCalculosId`) REFERENCES `energiacalculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `energiacalculosdetail` ADD CONSTRAINT `energiacalculosdetail_factorConversionSEINId_fkey` FOREIGN KEY (`factorConversionSEINId`) REFERENCES `factorconversionsein`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factorconversionsein` ADD CONSTRAINT `factorconversionsein_anioId_fkey` FOREIGN KEY (`anioId`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taxi` ADD CONSTRAINT `taxi_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taxi` ADD CONSTRAINT `taxi_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taxi` ADD CONSTRAINT `taxi_sede_id_fkey` FOREIGN KEY (`sede_id`) REFERENCES `sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoagua` ADD CONSTRAINT `consumoagua_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoagua` ADD CONSTRAINT `consumoagua_mes_id_fkey` FOREIGN KEY (`mes_id`) REFERENCES `mes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoagua` ADD CONSTRAINT `consumoagua_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factoremisionagua` ADD CONSTRAINT `factoremisionagua_anio_id_fkey` FOREIGN KEY (`anio_id`) REFERENCES `anio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoaguacalculos` ADD CONSTRAINT `consumoaguacalculos_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoaguacalculos` ADD CONSTRAINT `consumoaguacalculos_periodoCalculoId_fkey` FOREIGN KEY (`periodoCalculoId`) REFERENCES `periodocalculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoaguacalculosdetail` ADD CONSTRAINT `consumoaguacalculosdetail_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoaguacalculosdetail` ADD CONSTRAINT `consumoaguacalculosdetail_consumoAguaCalculosId_fkey` FOREIGN KEY (`consumoAguaCalculosId`) REFERENCES `consumoaguacalculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consumoaguacalculosdetail` ADD CONSTRAINT `consumoaguacalculosdetail_factorEmisionAguaId_fkey` FOREIGN KEY (`factorEmisionAguaId`) REFERENCES `factoremisionagua`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
