const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const {faker} = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
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

    const sedesNames = ["Sede Ayabacas", "Sede Central", "Sede La Capilla"];

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

    const tipoPapel = [
        // A3
        {
            nombre: "A3",
            ancho: 29.7,
            largo: 42.1,
            area: 0.125037,
            gramaje: 80.0,
            unidad_paquete: "500 hojas",
            porcentaje_reciclado: 80,
            porcentaje_virgen: 20,
            nombre_certificado: null,
        },
        {
            nombre: "A3",
            ancho: 29.7,
            largo: 42.1,
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
            largo: 29.7,
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
            largo: 29.7,
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

    for (const anio of allAnios) {
        await prisma.factorEmisionAgua.create({
            data: {
                factor: 0.344,
                anio_id: anio.id,
            },
        });
    }
    console.log("Water emission factor created");

    for (const anio of allAnios) {
        await prisma.factorEmisionTaxi.create({
            data: {
                factor: 0.100889,
                anio_id: anio.id,
            },
        });
    }
    console.log("Taxi emission factor created");


    for (const anio of allAnios) {
        await prisma.factorEmisionTransporteAereo.create({
            data: {
                factor1600: 0.29832,
                factor1600_3700: 0.29832,
                factor3700: 0.29832,
                anio_id: anio.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("Transporte aereo factors created");

    for (const anio of allAnios) {
        await prisma.factorEmisionTransporteTerrestre.create({
            data: {
                factor: 0.12007,
                anio_id: anio.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("Transporte terrestre factors created");

    const categoriaConsumibles = [
        {nombre: "INSUMOS ALIMENTARIOS"},
        {nombre: "MATERIAL DE LIMPIEZA"},
        {nombre: "MATERIAL DE OFICINA"},
    ];
    const grupoConsumibles = [
        {nombre: "Aceite vegetal"},
        {nombre: "Acrílico"},
        {nombre: "Agua embotellada"},
        {nombre: "Almendras"},
        {nombre: "Arroz"},
        {nombre: "Avena"},
        {nombre: "Azucar"},
        {nombre: "Café"},
        {nombre: "Caramelos"},
        {nombre: "Cartón"},
        {nombre: "Cartón plastificado"},
        {nombre: "Chocolate"},
        {nombre: "Desinfectante"},
        {nombre: "Detergente"},
        {nombre: "Galletas"},
        {nombre: "Gaseosa"},
        {nombre: "Hojas"},
        {nombre: "Huevos"},
        {nombre: "Jabón"},
        {nombre: "Jugo"},
        {nombre: "Lapicero"},
        {nombre: "leche evaporada"},
        {nombre: "Legumbres y otros granos"},
        {nombre: "Lejía"},
        {nombre: "Madera"},
        {nombre: "Mani"},
        {nombre: "Mantequilla"},
        {nombre: "Manzana"},
        {nombre: "Metal"},
        {nombre: "Pan"},
        {nombre: "Papel higiénico"},
        {nombre: "Plátano"},
        {nombre: "Plumón"},
        {nombre: "Polipropileno"},
        {nombre: "Queso"},
        {nombre: "Soda cáustica"},
        {nombre: "Tinta líquida"},
        {nombre: "Toner"},
        {nombre: "Yogurt"},
    ];
    const procesoConsumibles = [
        {nombre: "Paper and board for (fat) food packaging"},
        {
            nombre:
                "toner module production, laser printer, colour | toner module, laser printer, colour | APOS, U",
        },
        {nombre: "Life Cycle Comparison Report on a Ballpoint Pen"},
        {
            nombre:
                "Water, bottled, processed in FR | Ambient (long) | Already packed - PET | at packaging",
        },
        {nombre: "Soda, sugar and caffeine"},
        {nombre: "Biscuit"},
        {nombre: "Peanuts, unsalted"},
        {nombre: "Printing Ink, Black, conventional"},
        {nombre: "PP (Polypropylene)"},
        {nombre: "Paper, woodfree uncoated, bleached"},
        {nombre: "Steel hot rolled sheet USA"},
        {nombre: "market for soap | soap | APOS, U - GLO"},
        {nombre: "    Coffee"},
        {nombre: "Cheese, 20+"},
        {nombre: "Granulated sugar"},
        {nombre: "Apple"},
        {nombre: "Oil, sunflower"},
        {nombre: "Yogurt, whole"},
        {nombre: "Oak, European FSC/PEFC 710 (kg/m3)"},
        {nombre: "Butter, salted"},
        {nombre: "Sodium Hypochlorite, NaOCl (Plasticseurope 2013)"},
        {nombre: "Rice, white"},
        {nombre: "Syrup, sweetened"},
        {
            nombre:
                "Declaración Ambiental de producto Prodotti Tissue in pura cellulosa per uso igienico e domestico",
        },
        {nombre: "Chicken egg"},
        {nombre: "Bread, whole wheat"},
        {nombre: "Almonds, without membrane"},
        {nombre: "Chocolate, milk"},
        {
            nombre:
                "Board (solid) and recycled paper (test liner and fluting) in Europe",
        },
        {nombre: "Oatmeal"},
        {nombre: "Banana"},
        {nombre: "Milk, whole"},
        {nombre: "MMA (Methyl methacrylate)"},
    ];
    const descripcionConsumibles = [
        {descripcion: "ABASTECIMIENTO"},
        {descripcion: "ACADEMICA"},
        {descripcion: "ADMINISTRACION"},
        {descripcion: "ADMISION"},
        {descripcion: "ALIMENTARIAS"},
        {descripcion: "AMBIENTAL"},
        {descripcion: "ASEOSRIA"},
        {descripcion: "ASUNT ACADEM"},
        {descripcion: "BIENESTAR"},
        {descripcion: "CALIDAD"},
        {descripcion: "CIENCIAS"},
        {descripcion: "CONTABILIDAD"},
        {descripcion: "CONTROL INST"},
        {descripcion: "ECONOMIA"},
        {descripcion: "EJECTUTORA"},
        {descripcion: "EMPRESAS"},
        {descripcion: "FORMULADORA"},
        {descripcion: "GENERALES"},
        {descripcion: "GESTION EMPRESARIAL"},
        {descripcion: "GESTION PUBL"},
        {descripcion: "GESTION Y CIENCIAS"},
        {descripcion: "IMAGEN"},
        {descripcion: "INDUSTRIAL"},
        {descripcion: "INGENIERIA"},
        {descripcion: "INVERSIONES"},
        {descripcion: "INVESTIGACION"},
        {descripcion: "MECATRONICA"},
        {descripcion: "PLANEAMIENTO"},
        {descripcion: "PRESIDENCIA"},
        {descripcion: "PRESUPUESTO"},
        {descripcion: "PROYECCION"},
        {descripcion: "RELACIONES"},
        {descripcion: "RENOVABLES"},
        {descripcion: "RH"},
        {descripcion: "SECRETARIA GENERAL"},
        {descripcion: "SISTEMAS"},
        {descripcion: "TECNOLOGIAS"},
        {descripcion: "TESORERIA"},
        {descripcion: "TEXTIL"},
    ];

    for (const descripcion of descripcionConsumibles) {
        await prisma.descripcionConsumible.create({
            data: {
                descripcion: descripcion.descripcion,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    for (const categoria of categoriaConsumibles) {
        await prisma.categoriaConsumible.create({
            data: {
                nombre: categoria.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    for (const grupo of grupoConsumibles) {
        await prisma.grupoConsumible.create({
            data: {
                nombre: grupo.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    for (const proceso of procesoConsumibles) {
        await prisma.procesoConsumible.create({
            data: {
                nombre: proceso.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    // console.log({adminType, user});
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
