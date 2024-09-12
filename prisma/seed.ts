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
    console.log("Type User created");

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
    console.log("User created");

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
    console.log("Months created");

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
    console.log("Years created");

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
    console.log("Sedes created");

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
    console.log("Fuel types created");

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
    console.log("Fuel types factors created");

    const allSedes = await prisma.sede.findMany();
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
    console.log("Fuel data created");

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
    console.log("Fertilizer emission factors created");

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
    console.log("Fertilizer types created");

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
    console.log("GWP data created");

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
    console.log("Documents created");

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
    console.log("Fertilizer data created");

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
    console.log("Paper types created");

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
    console.log("Paper factors created");

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
    console.log("Paper consumption created");

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
    console.log("SEIN emission factors created");

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
    console.log("Areas created");

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
    console.log("Energy consumption created");

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
    console.log("Water consumption created");

    for (const anio of allAnios) {
        await prisma.factorEmisionAgua.create({
            data: {
                factor: 0.344,
                anio_id: anio.id,
            }
        })
    }
    console.log("Water emission factor created");

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
    console.log("Taxi data created");

    const TipoEquipoRefrigerante = [
        {nombre: "Refrigeradora doméstica"},
        {nombre: "Aplicación comercial - pequeño"},
        {nombre: "Aplicación comercial - mediano y grande"},
        {nombre: "Refrigeración en transporte"},
        {nombre: "Refrigeración industrial"},
        {nombre: "Chillers"},
        {nombre: "Aire acondicionado residencial y comercial"},
        {nombre: "Aire acondicionado móvil"},
    ];

    for (const tipo of TipoEquipoRefrigerante) {
        await prisma.tipoEquipoRefrigerante.create({
            data: {
                nombre: tipo.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("Refrigerant equipment types created");

    const TipoRefrigerante = [
        {nombre: "Trifluoroprop-1-ene", formula: "C3H2F4"},
        {nombre: "HFC-23", formula: "CHF3"},
        {nombre: "HFC-32", formula: "CH2F2"},
        {nombre: "HFC-41", formula: "CH3F"},
        {nombre: "HFC-125", formula: "CHF2CF3"},
        {nombre: "HFC-134", formula: "CHF2CHF2"},
        {nombre: "HFC-134a", formula: "CH2FCF3"},
        {nombre: "HFC-143", formula: "CH2FCHF2"},
        {nombre: "HFC-143a", formula: "CH3CF3"},
        {nombre: "HFC-152", formula: "CH2FCH2F"},
        {nombre: "HFC-152a", formula: "CH3CHF2"},
        {nombre: "HFC-161", formula: "CH3CH2F"},
        {nombre: "HFC-227ca", formula: "CF3CF2CHF2"},
        {nombre: "HFC-227ea", formula: "CF3CHFCF3"},
        {nombre: "HFC-236cb", formula: "CH2FCF2CF3"},
        {nombre: "HFC-236ea", formula: "CHF2CHFCF3"},
        {nombre: "HFC-236fa", formula: "CF3CH2CF3"},
        {nombre: "HFC-245ca", formula: "CH2FCF2CHF2"},
        {nombre: "HFC-245cb", formula: "CF3CF2CH3"},
        {nombre: "HFC-245ea", formula: "CHF2CHFCHF2"},
        {nombre: "HFC-245eb", formula: "CH2FCHFCF3"},
        {nombre: "HFC-245fa", formula: "CHF2CH2CF3"},
        {nombre: "HFC-263fb", formula: "CH3CH2CF3"},
        {nombre: "HFC-272ca", formula: "CH3CF2CH3"},
        {nombre: "HFC-329p", formula: "CHF2CF2CF2CF3"},
        {nombre: "HFC-365mfc", formula: "CH3CF2CH2CF3"},
        {nombre: "HFC-43-10mee", formula: "CF3CHFCHFCF2CF3"},
        {nombre: "HFC-1132a", formula: "CH2=CF2"},
        {nombre: "HFC-1141", formula: "CH2=CHF"},
        {nombre: "(Z)-HFC-1225ye", formula: "CF3CF=CHF(Z)"},
        {nombre: "(E)-HFC-1225ye", formula: "CF3CF=CHF(E)"},
        {nombre: "(Z)-HFC-1234ze", formula: "CF3CH=CHF(Z)"},
        {nombre: "HFC-1234yf", formula: "CF3CF=CH2"},
        {nombre: "(E)-HFC-1234ze", formula: "trans-CF3CH=CHF"},
        {nombre: "(Z)-HFC-1336", formula: "CF3CH=CHCF3(Z)"},
        {nombre: "HFC-1243zf", formula: "CF3CH=CH2"},
        {nombre: "HFC-1345zfc", formula: "C2F5CH=CH2"},
        {nombre: "Nonafluorohex-1-ene", formula: "C4F9CH=CH2"},
        {nombre: "Tridecafluorooct-1-ene", formula: "C6F13CH=CH2"},
        {nombre: "Heptadecafluorodec-1-ene", formula: "C8F17CH=CH2"},
    ];

    for (const tipo of TipoRefrigerante) {
        await prisma.tipoRefrigerante.create({
            data: {
                nombre: tipo.nombre,
                formula: tipo.formula,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("Refrigerant types created");

    const FactorTipoRefrigerante = [
        {PCA: 1, tipoRefrigeranteId: 1},
        {PCA: 12400, tipoRefrigeranteId: 2},
        {PCA: 677, tipoRefrigeranteId: 3},
        {PCA: 116, tipoRefrigeranteId: 4},
        {PCA: 3170, tipoRefrigeranteId: 5},
        {PCA: 1120, tipoRefrigeranteId: 6},
        {PCA: 1300, tipoRefrigeranteId: 7},
        {PCA: 328, tipoRefrigeranteId: 8},
        {PCA: 4800, tipoRefrigeranteId: 9},
        {PCA: 16, tipoRefrigeranteId: 10},
        {PCA: 138, tipoRefrigeranteId: 11},
        {PCA: 4, tipoRefrigeranteId: 12},
        {PCA: 2640, tipoRefrigeranteId: 13},
        {PCA: 3350, tipoRefrigeranteId: 14},
        {PCA: 1210, tipoRefrigeranteId: 15},
        {PCA: 1330, tipoRefrigeranteId: 16},
        {PCA: 8060, tipoRefrigeranteId: 17},
        {PCA: 716, tipoRefrigeranteId: 18},
        {PCA: 4620, tipoRefrigeranteId: 19},
        {PCA: 235, tipoRefrigeranteId: 20},
        {PCA: 290, tipoRefrigeranteId: 21},
        {PCA: 858, tipoRefrigeranteId: 22},
        {PCA: 76, tipoRefrigeranteId: 23},
        {PCA: 144, tipoRefrigeranteId: 24},
        {PCA: 2360, tipoRefrigeranteId: 25},
        {PCA: 804, tipoRefrigeranteId: 26},
        {PCA: 1650, tipoRefrigeranteId: 27},
        {PCA: 0, tipoRefrigeranteId: 28},
        {PCA: 0, tipoRefrigeranteId: 29},
        {PCA: 0, tipoRefrigeranteId: 30},
        {PCA: 0, tipoRefrigeranteId: 31},
        {PCA: 0, tipoRefrigeranteId: 32},
        {PCA: 0, tipoRefrigeranteId: 33},
        {PCA: 1, tipoRefrigeranteId: 34},
        {PCA: 2, tipoRefrigeranteId: 35},
        {PCA: 0, tipoRefrigeranteId: 36},
        {PCA: 0, tipoRefrigeranteId: 37},
        {PCA: 0, tipoRefrigeranteId: 38},
        {PCA: 0, tipoRefrigeranteId: 39},
        {PCA: 0, tipoRefrigeranteId: 40},
    ];

    for (const anio of allAnios) {
        for (const factor of FactorTipoRefrigerante) {
            await prisma.factorTipoRefrigerante.create({
                data: {
                    PCA100: factor.PCA,
                    anioId: anio.id,
                    tipoRefrigeranteId: factor.tipoRefrigeranteId,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }
    }
    console.log("Refrigerant factors created");

    const tiposRegistro = [
        "I", // Instalación
        "O", // Operación
        "D", // Disposición
    ];

    const allTipoEquipoRefrigerante = await prisma.tipoEquipoRefrigerante.findMany();
    const allTipoRefrigerante = await prisma.tipoRefrigerante.findMany();

    for (const sede of allSedes) {
        for (const anio of allAnios) {
            for (const tipo of tiposRegistro) {
                for (const tipoEquipo of allTipoEquipoRefrigerante) {
                    for (const tipoRefrigerante of allTipoRefrigerante) {
                        await prisma.refrigerante.create({
                            data: {
                                tipo: tipo,
                                tipoEquipoRefrigeranteId: tipoEquipo.id,
                                tipoRefrigeranteId: tipoRefrigerante.id,
                                sedeId: sede.id,
                                anioId: anio.id,
                                numeroEquipos: faker.number.int({min: 1, max: 10}),
                                cargaAnual: faker.number.float({min: 0.05, max: 10000}),
                                fugaInstalacion: faker.number.float({min: 0, max: 100}),
                                fugaUso: faker.number.float({min: 0, max: 100}),
                                tiempoUso: faker.number.float({min: 1, max: 10}),
                                fraccionDisposicion: faker.number.float({min: 0, max: 100}),
                                fraccionRecuperacion: faker.number.float({min: 0, max: 100}),
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                        });
                    }
                }
            }
        }
    }
    console.log("Refrigerant data created");

    // // console.log({adminType, user});
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
