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
        console.log("combustionMovilData", combustionMovilData);
        const co2emmissionsCombustionMovil = parseFloat((combustionMovilData.reduce((acc, curr) => acc + curr.emisionCO2, 0)).toFixed(2).toString());
        const ch4emmissionsCombustionMovil = parseFloat((combustionMovilData.reduce((acc, curr) => acc + curr.emisionCH4, 0)).toFixed(2).toString());
        const n2oemmissionsCombustionMovil = parseFloat((combustionMovilData.reduce((acc, curr) => acc + curr.emisionN2O, 0)).toFixed(2).toString());
        const totalEmissionsCombustionMovil = parseFloat((co2emmissionsCombustionMovil + ch4emmissionsCombustionMovil + n2oemmissionsCombustionMovil).toFixed(2).toString());

        const CombustionMovil: SummaryItem = {
            emissionSource: "Combustion Movil",
            co2Emissions: co2emmissionsCombustionMovil,
            ch4Emissions: ch4emmissionsCombustionMovil,
            n20Emissions: n2oemmissionsCombustionMovil,
            hfcEmissions: 0,
            totalEmissions: totalEmissionsCombustionMovil,
            generalContributions: 0
        };
        const CombustionEstacionaria: SummaryItem = {
            emissionSource: "Combustion Estacionaria",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const Extintores: SummaryItem = {
            emissionSource: "Extintores",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };

        const CATEGORIA1: SummaryItem = {
            emissionSource: "Categoria 1",
            co2Emissions: CombustionMovil.co2Emissions + CombustionEstacionaria.co2Emissions + Extintores.co2Emissions,
            ch4Emissions: CombustionMovil.ch4Emissions + CombustionEstacionaria.ch4Emissions + Extintores.ch4Emissions,
            n20Emissions: CombustionMovil.n20Emissions + CombustionEstacionaria.n20Emissions + Extintores.n20Emissions,
            hfcEmissions: CombustionMovil.hfcEmissions + CombustionEstacionaria.hfcEmissions + Extintores.hfcEmissions,
            totalEmissions: CombustionMovil.totalEmissions + CombustionEstacionaria.totalEmissions + Extintores.totalEmissions,
            generalContributions: CombustionMovil.generalContributions + CombustionEstacionaria.generalContributions + Extintores.generalContributions,
            category: true,
        };


        // CATEGORIA 2

        const ConsumoEnergia: SummaryItem = {
            emissionSource: "Consumo de Energia",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0,
        };

        const CATEGORIA2: SummaryItem = {
            emissionSource: "Categoria 2",
            co2Emissions: ConsumoEnergia.co2Emissions,
            ch4Emissions: ConsumoEnergia.ch4Emissions,
            n20Emissions: ConsumoEnergia.n20Emissions,
            hfcEmissions: ConsumoEnergia.hfcEmissions,
            totalEmissions: ConsumoEnergia.totalEmissions,
            generalContributions: ConsumoEnergia.generalContributions,
            category: true,
        };

        // CATEGORIA 3

        const TransporteAereo: SummaryItem = {
            emissionSource: "Transporte Aereo",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const TransporteTerrestre: SummaryItem = {
            emissionSource: "Transporte Terrestre",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const Taxis: SummaryItem = {
            emissionSource: "Taxis",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const TransporteCasaTrabajo: SummaryItem = {
            emissionSource: "Transporte Casa Trabajo",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };

        const CATEGORIA3: SummaryItem = {
            emissionSource: "Categoria 3",
            co2Emissions: TransporteAereo.co2Emissions + TransporteTerrestre.co2Emissions + Taxis.co2Emissions + TransporteCasaTrabajo.co2Emissions,
            ch4Emissions: TransporteAereo.ch4Emissions + TransporteTerrestre.ch4Emissions + Taxis.ch4Emissions + TransporteCasaTrabajo.ch4Emissions,
            n20Emissions: TransporteAereo.n20Emissions + TransporteTerrestre.n20Emissions + Taxis.n20Emissions + TransporteCasaTrabajo.n20Emissions,
            hfcEmissions: TransporteAereo.hfcEmissions + TransporteTerrestre.hfcEmissions + Taxis.hfcEmissions + TransporteCasaTrabajo.hfcEmissions,
            totalEmissions: TransporteAereo.totalEmissions + TransporteTerrestre.totalEmissions + Taxis.totalEmissions + TransporteCasaTrabajo.totalEmissions,
            generalContributions: TransporteAereo.generalContributions + TransporteTerrestre.generalContributions + Taxis.generalContributions + TransporteCasaTrabajo.generalContributions,
            category: true,
        };

        // CATEGORIA 4

        const ConsumoPapel: SummaryItem = {
            emissionSource: "Consumo de Papel",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const ConsumoAgua: SummaryItem = {
            emissionSource: "Consumo de Agua",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const ActivosFijos: SummaryItem = {
            emissionSource: "Activos Fijos",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };
        const ConsumiblesGenerales: SummaryItem = {
            emissionSource: "Consumibles Generales",
            co2Emissions: 0,
            ch4Emissions: 0,
            n20Emissions: 0,
            hfcEmissions: 0,
            totalEmissions: 0,
            generalContributions: 0
        };

        const CATEGORIA4: SummaryItem = {
            emissionSource: "Categoria 4",
            co2Emissions: ConsumoPapel.co2Emissions + ConsumoAgua.co2Emissions + ActivosFijos.co2Emissions + ConsumiblesGenerales.co2Emissions,
            ch4Emissions: ConsumoPapel.ch4Emissions + ConsumoAgua.ch4Emissions + ActivosFijos.ch4Emissions + ConsumiblesGenerales.ch4Emissions,
            n20Emissions: ConsumoPapel.n20Emissions + ConsumoAgua.n20Emissions + ActivosFijos.n20Emissions + ConsumiblesGenerales.n20Emissions,
            hfcEmissions: ConsumoPapel.hfcEmissions + ConsumoAgua.hfcEmissions + ActivosFijos.hfcEmissions + ConsumiblesGenerales.hfcEmissions,
            totalEmissions: ConsumoPapel.totalEmissions + ConsumoAgua.totalEmissions + ActivosFijos.totalEmissions + ConsumiblesGenerales.totalEmissions,
            generalContributions: ConsumoPapel.generalContributions + ConsumoAgua.generalContributions + ActivosFijos.generalContributions + ConsumiblesGenerales.generalContributions,
            category: true,
        };

        const EMISSIONS: SummaryItem = {
            emissionSource: "Emisiones Totales",
            co2Emissions: CATEGORIA1.co2Emissions + CATEGORIA2.co2Emissions + CATEGORIA3.co2Emissions + CATEGORIA4.co2Emissions,
            ch4Emissions: CATEGORIA1.ch4Emissions + CATEGORIA2.ch4Emissions + CATEGORIA3.ch4Emissions + CATEGORIA4.ch4Emissions,
            n20Emissions: CATEGORIA1.n20Emissions + CATEGORIA2.n20Emissions + CATEGORIA3.n20Emissions + CATEGORIA4.n20Emissions,
            hfcEmissions: CATEGORIA1.hfcEmissions + CATEGORIA2.hfcEmissions + CATEGORIA3.hfcEmissions + CATEGORIA4.hfcEmissions,
            totalEmissions: CATEGORIA1.totalEmissions + CATEGORIA2.totalEmissions + CATEGORIA3.totalEmissions + CATEGORIA4.totalEmissions,
            generalContributions: CATEGORIA1.generalContributions + CATEGORIA2.generalContributions + CATEGORIA3.generalContributions + CATEGORIA4.generalContributions,
            category: true,
        }

        CATEGORIA1.generalContributions = parseFloat(((CATEGORIA1.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        CATEGORIA2.generalContributions = parseFloat(((CATEGORIA2.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        CATEGORIA3.generalContributions = parseFloat(((CATEGORIA3.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        CATEGORIA4.generalContributions = parseFloat(((CATEGORIA4.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        CombustionMovil.generalContributions = parseFloat(((CombustionMovil.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        CombustionEstacionaria.generalContributions = parseFloat(((CombustionEstacionaria.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        Extintores.generalContributions = parseFloat(((Extintores.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        ConsumoEnergia.generalContributions = parseFloat(((ConsumoEnergia.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        TransporteAereo.generalContributions = parseFloat(((TransporteAereo.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        TransporteTerrestre.generalContributions = parseFloat(((TransporteTerrestre.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        Taxis.generalContributions = parseFloat(((Taxis.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        TransporteCasaTrabajo.generalContributions = parseFloat(((TransporteCasaTrabajo.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        ConsumoPapel.generalContributions = parseFloat(((ConsumoPapel.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        ConsumoAgua.generalContributions = parseFloat(((ConsumoAgua.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        ActivosFijos.generalContributions = parseFloat(((ActivosFijos.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());
        ConsumiblesGenerales.generalContributions = parseFloat(((ConsumiblesGenerales.totalEmissions / EMISSIONS.totalEmissions) * 100).toFixed(2).toString());

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
