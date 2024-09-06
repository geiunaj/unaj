const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const {faker} = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
    // Crear un tipo de usuario
    const adminType = await prisma.typeUser.create({
        data: {
            type_name: "admin",
        },
    });

    // Crear un usuario con el tipo de usuario creado
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@example.com",
            telefono: "123456789",
            password: hashedPassword,
            type_user_id: adminType.id,
        },
    });

    // Crear los meses
    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    for (const mes of meses) {
        await prisma.mes.create({
            data: {
                nombre: mes,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    // Crear los últimos 5 años
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
        await prisma.anio.create({
            data: {
                nombre: (currentYear - i).toString(),
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    const sedesNames = [
        "Sede Ayabacas",
        "Sede CENTRAL",
        "Sede La Capilla",
    ]

    for (const sedeName of sedesNames) {
        await prisma.sede.create({
            data: {
                name: sedeName,
            },
        });
    }

    // Crear los tipos de combustible
    const tiposCombustible = [
        {
            abreviatura: "P500",
            nombre: "Petróleo Industrial 500",
            unidad: "L",
            valorCalorico: 0.000151,
            factorEmisionCO2: 77.4,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "P6",
            nombre: "Petróleo Industrial 6",
            unidad: "L",
            valorCalorico: 0.000151,
            factorEmisionCO2: 77.4,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "GA",
            nombre: "Gasolina",
            unidad: "L",
            valorCalorico: 0.00012,
            factorEmisionCO2: 69.3,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "D2",
            nombre: "Diésel 2",
            unidad: "L",
            valorCalorico: 0.000142,
            factorEmisionCO2: 74.1,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "DB5",
            nombre: "Diésel B5",
            unidad: "L",
            valorCalorico: 0.000142,
            factorEmisionCO2: 74.1,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "GLP",
            nombre: "Gas Licuado de Petróleo",
            unidad: "L",
            valorCalorico: 0.00010464768,
            factorEmisionCO2: 63.1,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "GNL",
            nombre: "Gas Natural Licuado",
            unidad: "m³",
            valorCalorico: 0.01989,
            factorEmisionCO2: 64.2,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "GN",
            nombre: "Gas Natural",
            unidad: "m³",
            valorCalorico: 0.000036,
            factorEmisionCO2: 56.126,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "CO",
            nombre: "Coque",
            unidad: "kg",
            valorCalorico: 0.0267,
            factorEmisionCO2: 94.6,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "CM",
            nombre: "Carbón mineral antracita",
            unidad: "kg",
            valorCalorico: 0.0267,
            factorEmisionCO2: 98.3,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "CB",
            nombre: "Carbón mineral bituminoso",
            unidad: "kg",
            valorCalorico: 0.0258,
            factorEmisionCO2: 94.6,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "CV",
            nombre: "Carbón vegetal",
            unidad: "kg",
            valorCalorico: 0.0295,
            factorEmisionCO2: 112,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "BZ",
            nombre: "Bagazo",
            unidad: "kg",
            valorCalorico: 0.0116,
            factorEmisionCO2: 100,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "LE",
            nombre: "Leña",
            unidad: "kg",
            valorCalorico: 0.0116,
            factorEmisionCO2: 112,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "BI",
            nombre: "Biocombustible 100%",
            unidad: "L",
            valorCalorico: 0.000089,
            factorEmisionCO2: 70.8,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "ET",
            nombre: "Etanol",
            unidad: "L",
            valorCalorico: 0.00009,
            factorEmisionCO2: 70.8,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
        {
            abreviatura: "BG",
            nombre: "Biogás",
            unidad: "m³",
            valorCalorico: 0.000034272,
            factorEmisionCO2: 54.6,
            factorEmisionCH4: 3,
            factorEmisionN2O: 0.6,
        },
    ];

    const allAnios = await prisma.anio.findMany();
    const allMeses = await prisma.mes.findMany();

    for (const tipo of tiposCombustible) {
        await prisma.tipoCombustible.create({
            data: {
                nombre: tipo.nombre,
                abreviatura: tipo.abreviatura,
                unidad: tipo.unidad,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    const allTiposCombustible = await prisma.tipoCombustible.findMany();

    for (const anio of allAnios) {
        for (const tipo of allTiposCombustible) {
            const tipoSearch = tiposCombustible.find((t) => t.nombre === tipo.nombre);
            await prisma.tipoCombustibleFactor.create({
                data: {
                    valorCalorico: tipoSearch!.valorCalorico,
                    factorEmisionCO2: tipoSearch!.factorEmisionCO2,
                    factorEmisionCH4: tipoSearch!.factorEmisionCH4,
                    factorEmisionN2O: tipoSearch!.factorEmisionN2O,
                    anio_id: anio.id,
                    tipoCombustible_id: tipo.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }
    }

    const allSedes = await prisma.sede.findMany();
    const allTipoCombustibleFactor = await prisma.tipoCombustibleFactor.findMany();
    const types = ["estacionaria", "movil"];

    // Crear datos aleatorios para Combustible
    for (const type of types) {
        for (const sede of allSedes) {
            for (const anio of allAnios) {
                for (const mes of allMeses) {
                    const anio_mes = anio.nombre * 100 + mes.id;
                    await prisma.combustible.create({
                        data: {
                            tipo: type,
                            tipoEquipo: faker.lorem.word(),
                            consumo: faker.number.float({min: 0, max: 100}),
                            tipoCombustible_id: faker.helpers.arrayElement(allTiposCombustible).id,
                            mes_id: mes.id,
                            anio_id: anio.id,
                            sede_id: sede.id,
                            anio_mes,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
            }
        }
    }

    // Crear tipos de Fertilizantes
    const tiposFertilizantes = [
        {
            clase: "Sintético",
            nombre: "Urea",
            porcentajeNitrogeno: 46,
            unidad: "kg",
        },
        {
            clase: "Sintético",
            nombre: "Fosfato Diamónico (DAP)",
            porcentajeNitrogeno: 18,
            unidad: "kg",
        },
        {
            clase: "Sintético",
            nombre: "Nitrato de Amonio",
            porcentajeNitrogeno: 34,
            unidad: "kg",
        },
        {
            clase: "Sintético",
            nombre: "Fosfato Monoamónico (MAP)",
            porcentajeNitrogeno: 11,
            unidad: "kg",
        },
        {
            clase: "Sintético",
            nombre: "Sulfato de Amonio",
            porcentajeNitrogeno: 21,
            unidad: "kg",
        },
        {
            clase: "Orgánico",
            nombre: "Compost",
            porcentajeNitrogeno: 3,
            unidad: "kg",
        },
        {
            clase: "Orgánico",
            nombre: "Guano de Isla",
            porcentajeNitrogeno: 15,
            unidad: "kg",
        },
        {
            clase: "Orgánico",
            nombre: "Humus de Lombriz",
            porcentajeNitrogeno: 2,
            unidad: "kg",
        },
        {
            clase: "Orgánico",
            nombre: "Abono de Estiércol de Vacuno",
            porcentajeNitrogeno: 1,
            unidad: "kg",
        },
        {
            clase: "Orgánico",
            nombre: "Biofertilizante Líquido",
            porcentajeNitrogeno: 2,
            unidad: "L",
        },
    ];

    for (const anio of allAnios) {
        await prisma.factorEmisionFertilizante.create({
            data: {

                valor: 0.0125,
                anio_id: anio.id,

                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    for (const tipo of tiposFertilizantes) {
        await prisma.tipoFertilizante.create({
            data: {
                clase: tipo.clase,
                nombre: tipo.nombre,
                porcentajeNitrogeno: tipo.porcentajeNitrogeno,
                unidad: tipo.unidad,

                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    // Crear datos para GWP
    const gwpData = [
        {
            nombre: "Dióxido de carbono",
            formula: "CO2",
            valor: 1,
        },
        {
            nombre: "Metano - fosil",
            formula: "CH4",
            valor: 30,
        },
        {
            nombre: "Metano - biomasa",
            formula: "CH4",
            valor: 28,
        },
        {
            nombre: "Óxido nitroso",
            formula: "N2O",
            valor: 265,
        },
        {
            nombre: "Hexafluoruro de azufre",
            formula: "SF6",
            valor: 23500,
        },
        {
            nombre: "Trifluoruro de nitrógeno",
            formula: "NF3",
            valor: 16100,
        },
    ];
    for (const gwp of gwpData) {
        await prisma.gWP.create({
            data: {
                nombre: gwp.nombre,
                formula: gwp.formula,
                valor: gwp.valor,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    for (let i = 0; i < 100; i++) {
        await prisma.documento.create({
            data: {
                nombre: faker.lorem.words(),
                contenido: Buffer.from(faker.lorem.paragraphs()), // Asegúrate de que el contenido sea de tipo Bytes
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    const allTiposFertilizantes = await prisma.tipoFertilizante.findMany();
    // const allDocument = await prisma.documento.findMany(); // Asumiendo que 'document' es el nombre correcto del modelo

    // const fichaIds = allDocument.map((doc: { id: any }) => doc.id); // Obtener los IDs de los documentos creados

    for (const typeFertilizante of allTiposFertilizantes) {
        for (const sede of allSedes) {
            for (const anio of allAnios) {
                await prisma.fertilizante.create({
                    data: {
                        tipoFertilizante_id: typeFertilizante.id,
                        cantidad: faker.number.float({min: 0, max: 100}),
                        is_ficha: false,
                        ficha_id: null,
                        anio_id: anio.id,
                        sede_id: sede.id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    }

    const tipoPapel = [
        // A3
        {
            nombre: "A3",
            ancho: 29.70,
            largo: 42.10,
            area: 0.125037,
            gramaje: 80.0,
            unidad_paquete: "500 hojas",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: null,
        },
        {
            nombre: "A3",
            ancho: 29.70,
            largo: 42.10,
            area: 0.125037,
            gramaje: 90.0,
            unidad_paquete: "millar",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: "FSC",
        },
        {
            nombre: "A4",
            ancho: 21,
            largo: 29.70,
            area: 0.06237,
            gramaje: 70.0,
            unidad_paquete: "millar",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: null,
        },
        {
            nombre: "A4",
            ancho: 21,
            largo: 29.70,
            area: 0.06237,
            gramaje: 80.0,
            unidad_paquete: "millar",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: "FSC",
        },
        {
            nombre: "Letter",
            ancho: 21.59,
            largo: 27.94,
            area: 0.06032246,
            gramaje: 70.0,
            unidad_paquete: "500 hojas",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: null,
        },
        {
            nombre: "Letter",
            ancho: 21.59,
            largo: 27.94,
            area: 0.06032246,
            gramaje: 75.0,
            unidad_paquete: "500 hojas",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: "FSC",
        },
        {
            nombre: "Legal",
            ancho: 21.59,
            largo: 35.56,
            area: 0.07677404,
            gramaje: 80.0,
            unidad_paquete: "500 hojas",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: "FSC",
        },
        {
            nombre: "Legal",
            ancho: 21.59,
            largo: 35.56,
            area: 0.07677404,
            gramaje: 90.0,
            unidad_paquete: "500 hojas",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: null,
        },
    ];

    for (const tipo of tipoPapel) {
        await prisma.tipoPapel.create({
            data: {
                nombre: tipo.nombre,
                largo: tipo.largo,
                ancho: tipo.ancho,
                area: tipo.area,
                gramaje: tipo.gramaje,
                unidad_paquete: tipo.unidad_paquete,
                porcentaje_reciclado: tipo.porcentaje_reciclado,
                porcentaje_virgen: tipo.porcentaje_virgen,
                nombre_certificado: tipo.nombre_certificado,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    const allTiposPapel = await prisma.tipoPapel.findMany();

    for (const tipoPapel of allTiposPapel) {
        for (const anio of allAnios) {
            await prisma.factorTipoPapel.create({
                data: {
                    tipoPapelId: tipoPapel.id,
                    reciclado: 100,
                    virgen: 0,
                    anioId: anio.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }
    }

    for (const tipoPapel of allTiposPapel) {
        for (const sede of allSedes) {
            for (const anio of allAnios) {
                await prisma.consumoPapel.create({
                    data: {
                        tipoPapel_id: tipoPapel.id,
                        cantidad_paquete: faker.number.float({min: 1, max: 50}),
                        anio_id: anio.id,
                        sede_id: sede.id,

                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    }

    //Datos Factor de Emisión SEIN

    const emisionSEIN = [
        {
            factorCO2: 0.168088403,
            factorCH4: 0.000005552,
            factorN2O: 0.00000066,
            anioId: 5,
        },
        {
            factorCO2: 0.205780931,
            factorCH4: 0.000006533,
            factorN2O: 0.000001015,
            anioId: 4,
        },
        {
            factorCO2: 0.248289658,
            factorCH4: 0.000007353,
            factorN2O: 0.000001129,
            anioId: 3,
        },
        {
            factorCO2: 0.226922179,
            factorCH4: 0.000007427,
            factorN2O: 0.000000951,
            anioId: 2,
        },
        {
            factorCO2: 0.168088403,
            factorCH4: 0.000005552,
            factorN2O: 0.00000066,
            anioId: 1,
        },
    ];

    for (const factor of emisionSEIN) {
        await prisma.factorConversionSEIN.create({
            data: {
                factorCO2: factor.factorCO2,
                factorCH4: factor.factorCH4,
                factorN2O: factor.factorN2O,
                anioId: factor.anioId,
            },
        });
    }

    //Datos prueba para area

    for (const sede of allSedes) {
        for (let i = 0; i < 3; i++) {
            await prisma.area.create({
                data: {
                    nombre: `Area ${sede.id}${i + 1}`,
                    sede_id: sede.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }
    }

    const allAreas = await prisma.area.findMany({
        include: {
            sede: true,
        },
    });

    for (const area of allAreas) {
        for (const anio of allAnios) {
            for (const mes of allMeses) {
                const anio_mes = anio.nombre * 100 + mes.id;

                await prisma.consumoEnergia.create({
                    data: {
                        areaId: area.id,
                        numeroSuministro: faker.number
                            .int({min: 10000000, max: 99999999})
                            .toString(),
                        consumo: faker.number.float({min: 1, max: 200}),
                        mes_id: mes.id,
                        anio_id: anio.id,
                        anio_mes,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    }

    // Datos prueba para consumo de Agua
    for (const area of allAreas) {
        for (const anio of allAnios) {
            for (const mes of allMeses) {
                const anio_mes = anio.nombre * 100 + mes.id;
                await prisma.consumoAgua.create({
                    data: {
                        area_id: area.id,
                        codigoMedidor: faker.number
                            .int({min: 10000000, max: 99999999})
                            .toString(),
                        consumo: faker.number.float({min: 1, max: 10000}),
                        fuenteAgua: faker.helpers.arrayElement(["Red Publica", "Pozo"]),
                        mes_id: mes.id,
                        anio_id: anio.id,
                        anio_mes,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    }

    for (const anio of allAnios) {
        await prisma.factorEmisionAgua.create({
            data: {
                factor: 0.344,
                anio_id: anio.id,
            }
        })
    }

    for (const sede of allSedes) {
        for (const anio of allAnios) {
            for (const mes of allMeses) {
                const anio_mes = anio.nombre * 100 + mes.id;
                await prisma.taxi.create({
                    data: {
                        unidadContratante: `Unidad ${faker.number.int({min: 1, max: 10})}`,
                        lugarSalida: faker.location.city(),
                        lugarDestino: faker.location.city(),
                        montoGastado: faker.number.float({min: 10, max: 50, multipleOf: 0.5}),
                        mes_id: mes.id,
                        anio_id: anio.id,
                        sede_id: sede.id,
                        anio_mes,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    }

    console.log({adminType, user});
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
