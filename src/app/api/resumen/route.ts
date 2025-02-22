import {NextRequest, NextResponse} from "next/server";
import {SummaryItem} from "@/components/resumen/service/resumen.interface";
import prisma from "@/lib/prisma";
import {getAnioId} from "@/lib/utils";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const sedeId = searchParams.get("sedeId") ?? undefined;
        const yearFrom = searchParams.get("from") ?? undefined;
        const yearTo = searchParams.get("to") ?? "2024";
        const yearFromId = yearFrom ? await getAnioId(yearFrom) : undefined;
        const yearToId = yearTo ? await getAnioId(yearTo) : undefined;

        const fromValue = yearFromId ? Number(yearFrom) * 100 + 1 : undefined;
        const toValue = yearToId ? Number(yearTo) * 100 + 12 : undefined;

        // CATEGORIA 1
        const combustionMovilData = await prisma.combustibleCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
                tipo: "movil"
            }
        });
        const co2emmissionsCombustionMovil = parseFloat((combustionMovilData.reduce((acc, curr) => acc + curr.emisionCO2, 0)).toFixed(2).toString());
        const ch4emmissionsCombustionMovil = parseFloat((combustionMovilData.reduce((acc, curr) => acc + curr.emisionCH4, 0)).toFixed(2).toString());
        const n2oemmissionsCombustionMovil = parseFloat((combustionMovilData.reduce((acc, curr) => acc + curr.emisionN2O, 0)).toFixed(2).toString());
        const totalEmissionsCombustionMovil = parseFloat((co2emmissionsCombustionMovil + ch4emmissionsCombustionMovil + n2oemmissionsCombustionMovil).toFixed(2).toString());

        const CombustionMovil: SummaryItem = {
            emissionSource: "Combustión Móvil",
            co2Emissions: co2emmissionsCombustionMovil,
            ch4Emissions: ch4emmissionsCombustionMovil,
            N2OEmissions: n2oemmissionsCombustionMovil,
            hfcEmissions: 0,
            totalEmissions: totalEmissionsCombustionMovil,
            generalContributions: 0
        };

        const combustionEstacionariaData = await prisma.combustibleCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
                tipo: "estacionaria"
            }
        });
        const co2emmissionsCombustionEstacionaria = parseFloat((combustionEstacionariaData.reduce((acc, curr) => acc + curr.emisionCO2, 0)).toFixed(2).toString());
        const ch4emmissionsCombustionEstacionaria = parseFloat((combustionEstacionariaData.reduce((acc, curr) => acc + curr.emisionCH4, 0)).toFixed(2).toString());
        const n2oemmissionsCombustionEstacionaria = parseFloat((combustionEstacionariaData.reduce((acc, curr) => acc + curr.emisionN2O, 0)).toFixed(2).toString());
        const totalEmissionsCombustionEstacionaria = parseFloat((co2emmissionsCombustionEstacionaria + ch4emmissionsCombustionEstacionaria + n2oemmissionsCombustionEstacionaria).toFixed(2).toString());

        const CombustionEstacionaria: SummaryItem = {
            emissionSource: "Combustión Estacionaria",
            co2Emissions: co2emmissionsCombustionEstacionaria,
            ch4Emissions: ch4emmissionsCombustionEstacionaria,
            N2OEmissions: n2oemmissionsCombustionEstacionaria,
            hfcEmissions: 0,
            totalEmissions: totalEmissionsCombustionEstacionaria,
            generalContributions: 0
        };

        const extintorData = await prisma.extintorCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsExtintor = parseFloat((extintorData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());
        const Extintores: SummaryItem = {
            emissionSource: "Extintores",
            co2Emissions: co2emmissionsExtintor,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsExtintor,
            generalContributions: 0
        };

        const CATEGORIA1: SummaryItem = {
            emissionSource: "Categoria 1",
            co2Emissions: parseFloat((CombustionMovil.co2Emissions + CombustionEstacionaria.co2Emissions + Extintores.co2Emissions).toFixed(2).toString()),
            ch4Emissions: parseFloat((CombustionMovil.ch4Emissions + CombustionEstacionaria.ch4Emissions + Extintores.ch4Emissions).toFixed(2).toString()),
            N2OEmissions: parseFloat((CombustionMovil.N2OEmissions + CombustionEstacionaria.N2OEmissions + Extintores.N2OEmissions).toFixed(2).toString()),
            hfcEmissions: parseFloat((CombustionMovil.hfcEmissions + CombustionEstacionaria.hfcEmissions + Extintores.hfcEmissions).toFixed(2).toString()),
            totalEmissions: parseFloat((CombustionMovil.totalEmissions + CombustionEstacionaria.totalEmissions + Extintores.totalEmissions).toFixed(2).toString()),
            generalContributions: parseFloat((CombustionMovil.generalContributions + CombustionEstacionaria.generalContributions + Extintores.generalContributions).toFixed(2).toString()),
            category: true,
            chart: "categoria1",
            fill: "var(--color-categoria1)",
        };


        // CATEGORIA 2

        const consumoEnergiaData = await prisma.energiaCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                area: {
                    sede_id: sedeId ? parseInt(sedeId) : undefined,
                },
            }
        });
        const co2emmissionsConsumoEnergia = parseFloat((consumoEnergiaData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());

        const ConsumoEnergia: SummaryItem = {
            emissionSource: "Consumo de Energia",
            co2Emissions: co2emmissionsConsumoEnergia,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsConsumoEnergia,
            generalContributions: 0,
        };

        const CATEGORIA2: SummaryItem = {
            emissionSource: "Categoria 2",
            co2Emissions: ConsumoEnergia.co2Emissions,
            ch4Emissions: ConsumoEnergia.ch4Emissions,
            N2OEmissions: ConsumoEnergia.N2OEmissions,
            hfcEmissions: ConsumoEnergia.hfcEmissions,
            totalEmissions: ConsumoEnergia.totalEmissions,
            generalContributions: ConsumoEnergia.generalContributions,
            category: true,
            chart: "categoria2",
            fill: "var(--color-categoria2)",

        };

        // CATEGORIA 3

        const transporteAereoData = await prisma.transporteAereoCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsTransporteAereo = parseFloat((transporteAereoData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());
        const TransporteAereo: SummaryItem = {
            emissionSource: "Transporte Aereo",
            co2Emissions: co2emmissionsTransporteAereo,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsTransporteAereo,
            generalContributions: 0
        };

        const transporteTerrestreData = await prisma.transporteTerrestreCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsTransporteTerrestre = parseFloat((transporteTerrestreData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());
        const TransporteTerrestre: SummaryItem = {
            emissionSource: "Transporte Terrestre",
            co2Emissions: co2emmissionsTransporteTerrestre,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsTransporteTerrestre,
            generalContributions: 0
        };

        const taxiData = await prisma.taxiCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsTaxi = parseFloat((taxiData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());
        const Taxis: SummaryItem = {
            emissionSource: "Taxis",
            co2Emissions: co2emmissionsTaxi,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsTaxi,
            generalContributions: 0
        };

        const transporteCasaTrabajoData = await prisma.casaTrabajoCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsTransporteCasasTrabajo = parseFloat((transporteCasaTrabajoData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());
        const TransporteCasaTrabajo: SummaryItem = {
            emissionSource: "Transporte Casa Trabajo",
            co2Emissions: co2emmissionsTransporteCasasTrabajo,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsTransporteCasasTrabajo,
            generalContributions: 0
        };

        const CATEGORIA3: SummaryItem = {
            emissionSource: "Categoria 3",
            co2Emissions: parseFloat((TransporteAereo.co2Emissions + TransporteTerrestre.co2Emissions + Taxis.co2Emissions + TransporteCasaTrabajo.co2Emissions).toFixed(2).toString()),
            ch4Emissions: parseFloat((TransporteAereo.ch4Emissions + TransporteTerrestre.ch4Emissions + Taxis.ch4Emissions + TransporteCasaTrabajo.ch4Emissions).toFixed(2).toString()),
            N2OEmissions: parseFloat((TransporteAereo.N2OEmissions + TransporteTerrestre.N2OEmissions + Taxis.N2OEmissions + TransporteCasaTrabajo.N2OEmissions).toFixed(2).toString()),
            hfcEmissions: parseFloat((TransporteAereo.hfcEmissions + TransporteTerrestre.hfcEmissions + Taxis.hfcEmissions + TransporteCasaTrabajo.hfcEmissions).toFixed(2).toString()),
            totalEmissions: parseFloat((TransporteAereo.totalEmissions + TransporteTerrestre.totalEmissions + Taxis.totalEmissions + TransporteCasaTrabajo.totalEmissions).toFixed(2).toString()),
            generalContributions: parseFloat((TransporteAereo.generalContributions + TransporteTerrestre.generalContributions + Taxis.generalContributions + TransporteCasaTrabajo.generalContributions).toFixed(2).toString()),
            category: true,
            chart: "categoria3",
            fill: "var(--color-categoria3)",
        };

        // CATEGORIA 4

        const papelData = await prisma.consumoPapelCalculos.findMany({
            where: {
                Periodo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sede_id: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsPapel = parseFloat((papelData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());

        const ConsumoPapel: SummaryItem = {
            emissionSource: "Consumo de Papel",
            co2Emissions: co2emmissionsPapel,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsPapel,
            generalContributions: 0
        };

        const aguaData = await prisma.consumoAguaCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                area: {
                    sede_id: sedeId ? parseInt(sedeId) : undefined
                },
            }
        });
        const co2emmissionsAgua = parseFloat((aguaData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());

        const ConsumoAgua: SummaryItem = {
            emissionSource: "Consumo de Agua",
            co2Emissions: co2emmissionsAgua,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsAgua,
            generalContributions: 0
        };

        const ActivosFijosData = await prisma.activoCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsActivosFijos = parseFloat((ActivosFijosData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());

        const ActivosFijos: SummaryItem = {
            emissionSource: "Activos Fijos",
            co2Emissions: co2emmissionsActivosFijos,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsActivosFijos,
            generalContributions: 0
        };

        const consumiblesData = await prisma.consumibleCalculos.findMany({
            where: {
                PeriodoCalculo: {
                    fechaInicioValue: {
                        gte: fromValue,
                        lte: toValue,
                    },
                },
                sedeId: sedeId ? parseInt(sedeId) : undefined,
            }
        });
        const co2emmissionsConsumibles = parseFloat((consumiblesData.reduce((acc, curr) => acc + curr.totalGEI, 0)).toFixed(2).toString());

        const ConsumiblesGenerales: SummaryItem = {
            emissionSource: "Consumibles Generales",
            co2Emissions: co2emmissionsConsumibles,
            ch4Emissions: 0,
            N2OEmissions: 0,
            hfcEmissions: 0,
            totalEmissions: co2emmissionsConsumibles,
            generalContributions: 0
        };

        const CATEGORIA4: SummaryItem = {
            emissionSource: "Categoria 4",
            co2Emissions: parseFloat((ConsumoPapel.co2Emissions + ConsumoAgua.co2Emissions + ActivosFijos.co2Emissions + ConsumiblesGenerales.co2Emissions).toFixed(2).toString()),
            ch4Emissions: parseFloat((ConsumoPapel.ch4Emissions + ConsumoAgua.ch4Emissions + ActivosFijos.ch4Emissions + ConsumiblesGenerales.ch4Emissions).toFixed(2).toString()),
            N2OEmissions: parseFloat((ConsumoPapel.N2OEmissions + ConsumoAgua.N2OEmissions + ActivosFijos.N2OEmissions + ConsumiblesGenerales.N2OEmissions).toFixed(2).toString()),
            hfcEmissions: parseFloat((ConsumoPapel.hfcEmissions + ConsumoAgua.hfcEmissions + ActivosFijos.hfcEmissions + ConsumiblesGenerales.hfcEmissions).toFixed(2).toString()),
            totalEmissions: parseFloat((ConsumoPapel.totalEmissions + ConsumoAgua.totalEmissions + ActivosFijos.totalEmissions + ConsumiblesGenerales.totalEmissions).toFixed(2).toString()),
            generalContributions: parseFloat((ConsumoPapel.generalContributions + ConsumoAgua.generalContributions + ActivosFijos.generalContributions + ConsumiblesGenerales.generalContributions).toFixed(2).toString()),
            category: true,
            chart: "categoria4",
            fill: "var(--color-categoria4)",
        };

        const EMISSIONS: SummaryItem = {
            emissionSource: "Emisiones Totales",
            co2Emissions: parseFloat((CATEGORIA1.co2Emissions + CATEGORIA2.co2Emissions + CATEGORIA3.co2Emissions + CATEGORIA4.co2Emissions).toFixed(2)),
            ch4Emissions: parseFloat((CATEGORIA1.ch4Emissions + CATEGORIA2.ch4Emissions + CATEGORIA3.ch4Emissions + CATEGORIA4.ch4Emissions).toFixed(2)),
            N2OEmissions: parseFloat((CATEGORIA1.N2OEmissions + CATEGORIA2.N2OEmissions + CATEGORIA3.N2OEmissions + CATEGORIA4.N2OEmissions).toFixed(2)),
            hfcEmissions: parseFloat((CATEGORIA1.hfcEmissions + CATEGORIA2.hfcEmissions + CATEGORIA3.hfcEmissions + CATEGORIA4.hfcEmissions).toFixed(2)),
            totalEmissions: parseFloat((CATEGORIA1.totalEmissions + CATEGORIA2.totalEmissions + CATEGORIA3.totalEmissions + CATEGORIA4.totalEmissions).toFixed(2)),
            generalContributions: parseFloat((CATEGORIA1.generalContributions + CATEGORIA2.generalContributions + CATEGORIA3.generalContributions + CATEGORIA4.generalContributions).toFixed(2)),
            category: true,
        }

        CATEGORIA1.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((CATEGORIA1.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        CATEGORIA2.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((CATEGORIA2.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        CATEGORIA3.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((CATEGORIA3.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        CATEGORIA4.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((CATEGORIA4.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        // CATEGORIA1.generalContributions = 10;
        // CATEGORIA2.generalContributions = 30;
        // CATEGORIA3.generalContributions = 40;
        // CATEGORIA4.generalContributions = 30;
        CombustionMovil.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((CombustionMovil.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        CombustionEstacionaria.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((CombustionEstacionaria.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        Extintores.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((Extintores.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        ConsumoEnergia.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((ConsumoEnergia.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        TransporteAereo.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((TransporteAereo.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        TransporteTerrestre.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((TransporteTerrestre.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        Taxis.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((Taxis.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        TransporteCasaTrabajo.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((TransporteCasaTrabajo.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        ConsumoPapel.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((ConsumoPapel.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        ConsumoAgua.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((ConsumoAgua.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        ActivosFijos.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((ActivosFijos.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;
        ConsumiblesGenerales.generalContributions = EMISSIONS.totalEmissions !== 0 ? parseFloat(((ConsumiblesGenerales.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString()) : 0;

        const resumen: SummaryItem[] = [
            CATEGORIA1,
            CombustionMovil,
            CombustionEstacionaria,
            Extintores,
            CATEGORIA2,
            ConsumoEnergia,
            CATEGORIA3,
            TransporteAereo,
            TransporteTerrestre,
            Taxis,
            TransporteCasaTrabajo,
            CATEGORIA4,
            ConsumoPapel,
            ConsumoAgua,
            ActivosFijos,
            ConsumiblesGenerales,
            EMISSIONS
        ];

        return NextResponse.json(resumen);
    } catch (error) {
        console.error("Error", error);
        return new NextResponse("Error", {status: 500});
    }
}
