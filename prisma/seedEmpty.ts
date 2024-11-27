const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const {faker} = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
    const adminType = await prisma.typeUser.create({
        data: {
            type_name: "Administrador",
        },
    });
    const roles = ["Categoria 1", "Categoria 2", "Categoria 3", "Categoria 4"];
    for (const role of roles) {
        await prisma.typeUser.create({
            data: {
                type_name: role,
            },
        });
    }
    console.log("Type User created");

    for (let i = 1; i <= 40; i++) {
        await prisma.access.create({
            data: {
                menu: i,
                type_user_id: adminType.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

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
            abreviatura: "GA",
            nombre: "Gasolina",
            unidad: "gal",
            movil: {
                consumo: 825,
                factorEmisionCO2: 8.0507196,
                factorEmisionCH4: 0.1156026,
                factorEmisionN2O: 0.099635,
            },
        },
        {
            abreviatura: "DB5",
            nombre: "Diésel B5",
            unidad: "gal",
            movil: {
                consumo: 6133,
                factorEmisionCO2: 9.99609,
                factorEmisionCH4: 0.0125148,
                factorEmisionN2O: 0.0221567,
            },
        },
        {
            abreviatura: "GLP",
            nombre: "Gas Licuado de Petróleo",
            unidad: "gal",
            movil: {
                factorEmisionCO2: 6.31,
                factorEmisionCH4: 0.0031394,
                factorEmisionN2O: 0.0027732,
            },
            estacionaria: {
                consumo: 70.8,
                factorEmisionCO2: 6.6032686,
                factorEmisionCH4: 0.0031394,
                factorEmisionN2O: 0.0027732,
            }
        },
        {
            abreviatura: "C2H2",
            nombre: "Acetileno",
            unidad: "Kg",
            estacionaria: {
                consumo: 9,
                factorEmisionCO2: 3.38,
                factorEmisionCH4: 0,
                factorEmisionN2O: 0,
            }
        },
    ];

    const allAnios = await prisma.anio.findMany();
    const allMeses = await prisma.mes.findMany();

    for (const tipo of tiposCombustible) {
        const tipoCombustible = await prisma.tipoCombustible.create({
            data: {
                nombre: tipo.nombre,
                abreviatura: tipo.abreviatura,
                unidad: tipo.unidad,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        if (tipo.movil) {
            await prisma.tipoCombustibleFactor.create({
                data: {
                    tipo: "movil",
                    factorEmisionCO2: tipo.movil.factorEmisionCO2,
                    factorEmisionCH4: tipo.movil.factorEmisionCH4,
                    factorEmisionN2O: tipo.movil.factorEmisionN2O,
                    anio_id: 1,
                    tipoCombustible_id: tipoCombustible.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            if (tipo.movil.consumo) {
                await prisma.combustible.create({
                    data: {
                        tipo: "movil",
                        tipoEquipo: "Vehículo",
                        consumo: tipo.movil.consumo,
                        tipoCombustible_id: tipoCombustible.id,
                        mes_id: 1,
                        anio_id: 1,
                        sede_id: 1,
                        anio_mes: Number("2024") * 100 + Number(1),
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }

        if (tipo.estacionaria) {
            await prisma.tipoCombustibleFactor.create({
                data: {
                    tipo: "estacionaria",
                    factorEmisionCO2: tipo.estacionaria.factorEmisionCO2,
                    factorEmisionCH4: tipo.estacionaria.factorEmisionCH4,
                    factorEmisionN2O: tipo.estacionaria.factorEmisionN2O,
                    anio_id: 1,
                    tipoCombustible_id: tipoCombustible.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            if (tipo.estacionaria.consumo) {
                await prisma.combustible.create({
                    data: {
                        tipo: "estacionaria",
                        tipoEquipo: "Equipo",
                        consumo: tipo.estacionaria.consumo,
                        tipoCombustible_id: tipoCombustible.id,
                        mes_id: 1,
                        anio_id: 1,
                        sede_id: 1,
                        anio_mes: Number("2024") * 100 + Number(1),
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }
        }
    }
    console.log("Fuel types created");
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

    const transportesAereo = [
        {
            pasajeros: 32,
            origen: "Arequipa",
            destino: "Lima",
            distancia: 766.57,
            kmRecorridos: 1533.14,
        },
        {
            pasajeros: 34,
            origen: "Arequipa",
            destino: "Lima",
            distancia: 766.57,
            kmRecorridos: 1533.14,
        },
        {
            pasajeros: 35,
            origen: "Arequipa",
            destino: "Lima",
            distancia: 766.57,
            kmRecorridos: 1533.14,
        },
        {
            pasajeros: 347,
            origen: "Arequipa",
            destino: "Lima",
            distancia: 766.57,
            kmRecorridos: 1533.14,
        },
        {
            pasajeros: 348,
            origen: "Arequipa",
            destino: "Lima",
            distancia: 766.57,
            kmRecorridos: 1533.14,
        },
        {
            pasajeros: 47,
            origen: "Cuzco",
            destino: "Lima",
            distancia: 586.21,
            kmRecorridos: 586.21,
        },
        {
            pasajeros: 49,
            origen: "Cuzco",
            destino: "Lima",
            distancia: 586.21,
            kmRecorridos: 1172.42,
        },
        {
            pasajeros: 62,
            origen: "Cuzco",
            destino: "Lima",
            distancia: 586.21,
            kmRecorridos: 1172.42,
        },
        {
            pasajeros: 520,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 521,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 522,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 548,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 549,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 550,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 550,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 607,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 608,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 609,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 610,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 653,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 696,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 700,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 700,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 700,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 700,
            origen: "Juliaca",
            destino: "lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 747,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 748,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 749,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 750,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 751,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 752,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 814,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 844,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 845,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 847,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 848,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 851,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 925,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 1333,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 1403,
            origen: "Juliaca",
            destino: "Lima",
            distancia: 843.51,
            kmRecorridos: 1687.02,
        },
        {
            pasajeros: 33,
            origen: "Lima",
            destino: "Arequipa",
            distancia: 766.57,
            kmRecorridos: 766.57,
        },
        {
            pasajeros: 48,
            origen: "Lima",
            destino: "Cuzco",
            distancia: 586.21,
            kmRecorridos: 1172.42,
        },
        {
            pasajeros: 602,
            origen: "Lima",
            destino: "Juliaca",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 605,
            origen: "Lima",
            destino: "Juliaca",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 605,
            origen: "Lima",
            destino: "Juliaca",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 605,
            origen: "Lima",
            destino: "Jauja",
            distancia: 180.52,
            kmRecorridos: 361.04,
        },
        {
            pasajeros: 605,
            origen: "Lima",
            destino: "Trujillo",
            distancia: 489.38,
            kmRecorridos: 978.76,
        },
        {
            pasajeros: 605,
            origen: "Lima",
            destino: "Trujillo",
            distancia: 489.38,
            kmRecorridos: 978.76,
        },
        {
            pasajeros: 605,
            origen: "Lima",
            destino: "Ayacucho",
            distancia: 340.09,
            kmRecorridos: 680.18,
        },
        {
            pasajeros: 846,
            origen: "Lima",
            destino: "Juliaca",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 849,
            origen: "Lima",
            destino: "Juliaca",
            distancia: 843.51,
            kmRecorridos: 843.51,
        },
        {
            pasajeros: 849,
            origen: "Lima",
            destino: "Iquitos",
            distancia: 1007.05,
            kmRecorridos: 2014.1,
        },
        {
            pasajeros: 849,
            origen: "Lima",
            destino: "Trujillo",
            distancia: 489.38,
            kmRecorridos: 978.76,
        },
        {
            pasajeros: 746,
            origen: "Trujillo",
            destino: "Lima",
            distancia: 489.38,
            kmRecorridos: 489.38,
        },
    ];

    for (const transporteAereo of transportesAereo) {
        await prisma.transporteAereo.create({
            data: {
                numeroPasajeros: transporteAereo.pasajeros,
                origen: transporteAereo.origen,
                destino: transporteAereo.destino,
                isIdaVuelta: true,
                fechaSalida: new Date(),
                fechaRegreso: new Date(),
                distanciaTramo: transporteAereo.distancia,
                kmRecorrido: transporteAereo.kmRecorridos,
                mes_id: 1,
                anio_id: 1,
                sede_id: 1,
                anio_mes: Number("2024") * 100 + Number(1),
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

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

    const tranporteTerrestre = [
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Arequipa - Arequipa - Arequipa",
            comprobante: 25,
            distancia: 260,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Tacna - Tacna - Tacna",
            comprobante: 314,
            distancia: 412.9,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Tacna - Tacna - Tacna",
            comprobante: 315,
            distancia: 412.9,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Tacna - Tacna - Tacna",
            comprobante: 316,
            distancia: 412.9,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Tacna - Tacna - Tacna",
            comprobante: 317,
            distancia: 412.9,
        },
        {
            origen: "Lima - Lima - Lima",
            destino: "Junin - Huancayo - Huancayo",
            comprobante: 498,
            distancia: 301.3,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 463,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 464,
            distancia: 1267,
        },
        {
            origen: "Lima - Lima - Lima",
            destino: "Junin- Huancayo - Huancayo",
            comprobante: 498,
            distancia: 301.3,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Cusco - La Convensión - Santa Ana",
            comprobante: 561,
            distancia: 547.2,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Cusco - La Convensión - Santa Ana",
            comprobante: 562,
            distancia: 547.2,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 769,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 772,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 773,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 780,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 848,
            distancia: 1267,
        },
        {
            origen: "Junin -Jauja - Jauja",
            destino: "Junin- Huancayo - Chilca",
            comprobante: 1101,
            distancia: 51.4,
        },
        {
            origen: "Junin - Huancayo - Chilca",
            destino: "Huancavelica- Huancavelica - Izcuchaca",
            comprobante: 1101,
            distancia: 64.7,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1162,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1163,
            distancia: 1267,
        },
        {
            origen: "Lima - Lima - Lima	",
            destino: "Puno- San Roman - Juliaca",
            comprobante: 1213,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Arequipa - Arequipa - Arequipa",
            comprobante: 1385,
            distancia: 260,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1664,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1665,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1666,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1667,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1668,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1727,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1728,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1826,
            distancia: 1267,
        },
        {
            origen: "Lima - Lima - Lima",
            destino: "Ica - Ica - Ica",
            comprobante: 1945,
            distancia: 303.7,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Lima - Lima - Lima",
            comprobante: 1954,
            distancia: 1267,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Cusco - Cusco - Cusco",
            comprobante: 2231,
            distancia: 344.5,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Cusco - Cusco - Cusco",
            comprobante: 2232,
            distancia: 344.5,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Cusco - Cusco - Cusco",
            comprobante: 2233,
            distancia: 344.5,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Cusco - Cusco - Cusco",
            comprobante: 2636,
            distancia: 344.5,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Arequipa - Arequipa - Arequipa",
            comprobante: 2785,
            distancia: 260,
        },
        {
            origen: "Puno - San Roman - Juliaca",
            destino: "Arequipa - Arequipa - Arequipa",
            comprobante: 2786,
            distancia: 260,
        },
    ];

    for (const transporteTerrestre of tranporteTerrestre) {
        await prisma.transporteTerrestre.create({
            data: {
                numeroPasajeros: 1,
                origen: transporteTerrestre.origen,
                destino: transporteTerrestre.destino,
                isIdaVuelta: true,
                fechaSalida: new Date(),
                fechaRegreso: new Date(),
                motivo: "Trabajo",
                numeroComprobante: transporteTerrestre.comprobante.toString(),
                distancia: transporteTerrestre.distancia,
                mes_id: 1,
                anio_id: 1,
                sede_id: 1,
                anio_mes: Number("2024") * 100 + Number(1),
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

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
    const tipoConsumibles = [
        {nombre: "ACEITE VEGETAL COMESTIBLE", unidad: "kg", factor: 0.12089},
        {
            nombre: "AGUA DE MESA SIN GAS X 20 L + ENVASE",
            unidad: "kg",
            factor: 0.12089,
        },
        {
            nombre: "AGUA DE MESA SIN GAS X 625 mL",
            unidad: "kg",
            factor: 0.726214729,
        },
        {
            nombre: "AGUA DE MESA SIN GAS X 625 mL X 15",
            unidad: "kg",
            factor: 0.404862053,
        },
        {nombre: "AGUA MINERAL SIN GAS X 20 L", unidad: "kg", factor: 0.026855},
        {
            nombre: "AGUA MINERAL SIN GAS X 355 mL",
            unidad: "kg",
            factor: 0.351411564,
        },
        {
            nombre: "AGUA MINERAL SIN GAS X 625 mL APROX.",
            unidad: "kg",
            factor: 0.12089,
        },
        {nombre: "ALMENDRA (KG)", unidad: "kg", factor: 0.448021789},
        {
            nombre:
                "ARCHIVADOR DE CARTON PLASTIFICADO CON PALANCA LOMO ANCHO TAMAÑO OFICIO",
            unidad: "kg",
            factor: 0.448021789,
        },
        {
            nombre: "ARCHIVADOR DE PLÁSTICO DE PALANCA LOMO ANCHO TAMAÑO A4",
            unidad: "kg",
            factor: 0.026855,
        },
        {
            nombre: "ARCHIVADOR DE PLÁSTICO DE PALANCA LOMO ANCHO TAMAÑO A5",
            unidad: "kg",
            factor: 0.438471383,
        },
        {nombre: "ARROZ EXTRA", unidad: "kg", factor: 0.438471383},
        {
            nombre: "ATUN EN FILETE EN ACEITE VEGETAL X 170 g",
            unidad: "kg",
            factor: 0.438471383,
        },
        {nombre: "AZUCAR RUBIA DOMESTICA", unidad: "kg", factor: 0.438471383},
        {nombre: "BEBIDA GASEOSA X 285 mL", unidad: "kg", factor: 0.438471383},
        {
            nombre: "BEBIDA GASEOSA X 300 mL AMARILLA",
            unidad: "kg",
            factor: 0.438471383,
        },
        {nombre: "BEBIDA GASEOSA X 350 mL", unidad: "kg", factor: 0.438471383},
        {nombre: "BEBIDA GASEOSA X 600 mL", unidad: "kg", factor: 0.438471383},
        {
            nombre: "BOLÍGRAFO (LAPICERO) DE TINTA LÍQUIDA PUNTA FINA COLOR AZUL",
            unidad: "kg",
            factor: 0.438471383,
        },
        {
            nombre: "BOLIGRAFO (LAPICERO) DE TINTA SECA PUNTA FINA COLOR NEGRO",
            unidad: "kg",
            factor: 0.438471383,
        },
        {
            nombre: "BOLIGRAFO (LAPICERO) DE TINTA SECA PUNTA MEDIA COLOR AZUL",
            unidad: "kg",
            factor: 0.438471383,
        },
        {
            nombre: "BOLIGRAFO (LAPICERO) DE TINTA SECA PUNTA MEDIA ECOLOGICO",
            unidad: "kg",
            factor: 0.438471383,
        },
        {
            nombre: "BOLIGRAFO (LAPICERO) TINTA GEL PUNTA FINA COLOR AZUL",
            unidad: "kg",
            factor: 0.438471383,
        },
        {nombre: "CAFÉ INSTANTÁNEO X 250 g", unidad: "kg", factor: 0.438471383},
        {nombre: "CAÑIHUA TOSTADA MOLIDA", unidad: "kg", factor: 0.438471383},
        {nombre: "CARAMELO DURO (CIENTO)", unidad: "kg", factor: 0.438471383},
        {nombre: "CHOCOLATE EN PASTA X 400 g", unidad: "kg", factor: 0.438471383},
        {
            nombre: "CINTA DE PAPEL PARA ENMASCARAR - MASKING TAPE 2 in X 40 yd",
            unidad: "kg",
            factor: 0.438471383,
        },
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

    const allDescripcionConsumibles =
        await prisma.descripcionConsumible.findMany();
    const allCategoriaConsumibles = await prisma.categoriaConsumible.findMany();
    const allGrupoConsumibles = await prisma.grupoConsumible.findMany();
    const allProcesoConsumibles = await prisma.procesoConsumible.findMany();

    for (const tipoConsumible of tipoConsumibles) {
        const newTipoConsumible = await prisma.tipoConsumible.create({
            data: {
                nombre: tipoConsumible.nombre,
                unidad: tipoConsumible.unidad,
                descripcionId: faker.helpers.arrayElement(allDescripcionConsumibles).id,
                categoriaId: faker.helpers.arrayElement(allCategoriaConsumibles).id,
                grupoId: faker.helpers.arrayElement(allGrupoConsumibles).id,
                procesoId: faker.helpers.arrayElement(allProcesoConsumibles).id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        for (const anio of allAnios) {
            await prisma.factorTipoConsumible.create({
                data: {
                    factor: tipoConsumible.factor,
                    tipoConsumibleId: newTipoConsumible.id,
                    anioId: anio.id,
                    fuente: "Manual de Emisiones",
                    link: "/",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }
    }

    const grupoActivos: {
        nombre: string;
        categoria: string[];
        factor: number;
    }[] = [
        {
            nombre: "Steel hot rolled sheet USA",
            categoria: ["Metal", "Acero"],
            factor: 2.305375489,
        },
        {
            nombre: "Pitch Pine natural forest, clear cut 750 (kg/m3)",
            categoria: ["Madera"],
            factor: 3.688769398,
        },
        {
            nombre: "Computer desktop, including 27 inch display",
            categoria: ["Computadora"],
            factor: 623.42,
        },
        {
            nombre: "Electrical items - large",
            categoria: ["Equipo eléctrico grande"],
            factor: 3.267,
        },
        {
            nombre: "LCD flat screen, 27 inch, including casing and electronics",
            categoria: ["Monitor"],
            factor: 321.2278872,
        },
        {
            nombre: "Electrical items - small",
            categoria: ["Equipo eléctrico pequeño"],
            factor: 5.647,
        },
        {
            nombre: "PP (Polypropylene)",
            categoria: ["Polipropileno"],
            factor: 1.63,
        },
        {
            nombre: "Electrical items - IT",
            categoria: ["Teclado", "Equipo TI"],
            factor: 24.865,
        },
        {
            nombre: "PE (HDPE, High density Polyethylene)",
            categoria: ["Polietileno alta densidad"],
            factor: 1.8,
        },
        {
            nombre: "Particle board  standard (Rotterdam)",
            categoria: ["Melamina"],
            factor: 0.659941271,
        },
        {
            nombre: "PVC (Polyvinylchloride emulsion polymerised)",
            categoria: ["PVC"],
            factor: 2.37,
        },
    ];

    for (const grupo of grupoActivos) {
        const newGrupo = await prisma.grupoActivo.create({
            data: {
                nombre: grupo.nombre,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        for (const cat of grupo.categoria) {
            await prisma.categoriaActivo.create({
                data: {
                    nombre: cat,
                    grupoActivoId: newGrupo.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
        }

        await prisma.factorTipoActivo.create({
            data: {
                factor: grupo.factor,
                anioId: 1,
                grupoActivoId: newGrupo.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("Asset groups created");

    const taxis: { monto: number }[] = [
        {monto: 50},
        {monto: 42},
        {monto: 50},
        {monto: 50},
        {monto: 50},
        {monto: 55},
        {monto: 16.6},
        {monto: 60},
        {monto: 60},
        {monto: 70},
        {monto: 73.59},
        {monto: 60},
        {monto: 60},
        {monto: 45.6},
        {monto: 50},
        {monto: 50},
        {monto: 50},
        {monto: 45},
        {monto: 32},
        {monto: 44},
        {monto: 45},
        {monto: 42.5},
        {monto: 43},
        {monto: 40},
        {monto: 40},
        {monto: 31},
        {monto: 50},
        {monto: 40},
        {monto: 39},
        {monto: 60},
        {monto: 60},
        {monto: 20},
        {monto: 18},
        {monto: 21},
        {monto: 22},
        {monto: 18},
        {monto: 20},
        {monto: 60},
        {monto: 20},
        {monto: 23},
        {monto: 20},
        {monto: 22},
        {monto: 22},
        {monto: 20},
        {monto: 60},
        {monto: 25},
        {monto: 20.5},
        {monto: 20},
        {monto: 20},
        {monto: 20},
        {monto: 20},
        {monto: 45},
        {monto: 50},
        {monto: 40},
        {monto: 50},
        {monto: 60},
        {monto: 50},
        {monto: 60},
        {monto: 73},
        {monto: 70},
        {monto: 60},
        {monto: 60},
        {monto: 50},
        {monto: 50},
        {monto: 30},
        {monto: 28},
        {monto: 50},
        {monto: 60},
        {monto: 15},
        {monto: 15},
        {monto: 15},
        {monto: 15},
        {monto: 60},
        {monto: 60},
        {monto: 20},
        {monto: 60},
        {monto: 17},
        {monto: 17},
        {monto: 18},
        {monto: 18},
        {monto: 55},
        {monto: 35},
        {monto: 35},
        {monto: 35},
        {monto: 33},
        {monto: 35},
        {monto: 30},
        {monto: 55},
        {monto: 60},
        {monto: 25},
        {monto: 25},
        {monto: 25},
        {monto: 30},
        {monto: 30},
        {monto: 35},
        {monto: 20},
        {monto: 20},
        {monto: 33},
        {monto: 30},
        {monto: 30},
        {monto: 30},
        {monto: 33.5},
        {monto: 50},
        {monto: 42},
        {monto: 50},
        {monto: 40},
        {monto: 40},
        {monto: 50},
        {monto: 43.2},
        {monto: 50},
        {monto: 14.56},
        {monto: 25},
        {monto: 15},
        {monto: 16},
        {monto: 15},
        {monto: 16},
        {monto: 16},
        {monto: 30},
        {monto: 40},
        {monto: 30},
        {monto: 50},
        {monto: 45},
        {monto: 45.7},
        {monto: 50},
        {monto: 16.95},
        {monto: 50},
        {monto: 20},
        {monto: 20},
        {monto: 20},
        {monto: 20},
        {monto: 20},
        {monto: 20},
        {monto: 38},
    ];

    for (const taxi of taxis) {
        await prisma.taxi.create({
            data: {
                unidadContratante: "Unidad",
                lugarSalida: "Origen",
                lugarDestino: "Destino",
                montoGastado: taxi.monto,
                kmRecorrido: parseFloat(((taxi.monto - 4.2) / 0.9).toFixed(2)),
                mes_id: 1,
                anio_id: 1,
                sede_id: 1,
                anio_mes: Number("2024") * 100 + Number(1),
            },
        });
    }

    const factorCasaTrabajo = [
        {
            consumo: 715318.2,
            vehiculo: "Auto particular a Diesel",
            factorCO2: 0.17167,
            factorCH4: 0.0000003,
            factorN2O: 0.0000062,
            factor: 0.173322,
        },
        {
            consumo: 1489766.9,
            vehiculo: "Auto particular a Gasolina",
            factorCO2: 0.19311,
            factorCH4: 0.000011,
            factorN2O: 0.0000014,
            factor: 0.193811,
        },
        {
            consumo: 771906.4,
            vehiculo: "Auto particular a GLP",
            factorCO2: 0.1816,
            factorCH4: 0.0000023,
            factorN2O: 0.0000017,
            factor: 0.1821195,
        },
        {
            consumo: 702219.9,
            vehiculo: "Bicicleta",
            factorCO2: 0,
            factorCH4: 0,
            factorN2O: 0,
            factor: 0,
        },
        {
            consumo: 592121.8,
            vehiculo: "Buses",
            factorCO2: 0.10017,
            factorCH4: 0.000001,
            factorN2O: 0.0000026,
            factor: 0.100889,
        },
        {
            consumo: 80477.6,
            vehiculo: "Caminando",
            factorCO2: 0,
            factorCH4: 0,
            factorN2O: 0,
            factor: 0,
        },
        {
            consumo: 2595136.1,
            vehiculo: "Combi o cúster",
            factorCO2: 0.10017,
            factorCH4: 0.000001,
            factorN2O: 0.0000026,
            factor: 0.100889,
        },
        {
            consumo: 1114001.5,
            vehiculo: "Moto",
            factorCO2: 0.08248,
            factorCH4: 0.0000617,
            factorN2O: 0.000001,
            factor: 0.084596,
        },
        {
            consumo: 10846.3,
            vehiculo: "Mototaxi",
            factorCO2: 0.08248,
            factorCH4: 0.0000617,
            factorN2O: 0.000001,
            factor: 0.084596,
        },
        {
            consumo: 6327.0,
            vehiculo: "Scooter eléctrico",
            factorCO2: 0,
            factorCH4: 0,
            factorN2O: 0,
            factor: 0,
        },
        {
            consumo: 129703.2,
            vehiculo: "Taxi",
            factorCO2: 0.15211,
            factorCH4: 0.000003,
            factorN2O: 0.0000044,
            factor: 0.153366,
        },
        {
            consumo: 1719049.4,
            vehiculo: "Vehículo colectivo",
            factorCO2: 0.0,
            factorCH4: 0.0,
            factorN2O: 0.0,
            factor: 0.048453,
        },
    ];

    for (const factor of factorCasaTrabajo) {
        const tipoVehiculo = await prisma.tipoVehiculo.create({
            data: {
                nombre: factor.vehiculo,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        await prisma.factorTransporteCasaTrabajo.create({
            data: {
                tipoVehiculoId: tipoVehiculo.id,
                factorCO2: factor.factorCO2,
                factorCH4: factor.factorCH4,
                factorN2O: factor.factorN2O,
                factor: factor.factor,
                created_at: new Date(),
                updated_at: new Date(),
                anioId: 1,
            },
        });

        await prisma.casaTrabajo.create({
            data: {
                tipo: "ALUMNO",
                tipoVehiculoId: tipoVehiculo.id,
                kmRecorrido: factor.consumo,
                sedeId: 1,
                anioId: 1,
                mesId: 1,
                anio_mes: Number("2024") * 100 + Number(1),
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("Casa-trabajo data created");

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
