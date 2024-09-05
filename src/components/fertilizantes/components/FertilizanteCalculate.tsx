"use client";
import React, {useState, useCallback, useRef} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Building} from "lucide-react";
import SelectFilter from "@/components/SelectFilter";
import {Badge} from "@/components/ui/badge";
import {FertilizanteCalcResponse} from "../services/fertilizanteCalculate.interface";
import ButtonCalculate from "@/components/ButtonCalculate";
import ButtonBack from "@/components/ButtonBack";
import {useRouter} from "next/navigation";
import ReportComponent from "@/components/ReportComponent";
import GenerateReport from "@/lib/utils/generateReport";
import {formatPeriod} from "@/lib/utils/core.function";
import {
    useFertilizanteCalculos,
    useFertilizanteCalculosReport, useSedes
} from "@/components/fertilizantes/lib/fertilizantesCalculos.hooks";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {createFertilizanteCalculate} from "@/components/fertilizantes/services/fertilizanteCalculate.actions";
import {ReportRequest} from "@/lib/interfaces/globals";

export default function FertilizanteCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [yearFrom, setYearFrom] = useState<string>(new Date().getFullYear().toString());
    const [yearTo, setYearTo] = useState<string>(new Date().getFullYear().toString());
    const [page, setPage] = useState(1);

    const fertilizanteCalculos = useFertilizanteCalculos({
        sedeId: parseInt(selectedSede),
        yearFrom: yearFrom,
        yearTo: yearTo,
        page,
    });
    const fertilizanteCalculosReport = useFertilizanteCalculosReport({
        sedeId: parseInt(selectedSede),
        yearFrom: yearFrom,
        yearTo: yearTo,
    });

    const sedes = useSedes();
    const handleFertilizante = () => {
        push("/fertilizante");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await fertilizanteCalculos.refetch();
        await fertilizanteCalculosReport.refetch();
    }, [fertilizanteCalculos, fertilizanteCalculosReport]);

    const handleYearFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setYearFrom(value);
        await fertilizanteCalculos.refetch();
        await fertilizanteCalculosReport.refetch();
    }, [fertilizanteCalculos, fertilizanteCalculosReport]);

    const handleYearToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setYearTo(value);
        await fertilizanteCalculos.refetch();
        await fertilizanteCalculosReport.refetch();
    }, [fertilizanteCalculos, fertilizanteCalculosReport]);

    const handleCalculate = useCallback(async () => {
        await createFertilizanteCalculate({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            yearFrom,
            yearTo,
        });
        fertilizanteCalculos.refetch();
        fertilizanteCalculosReport.refetch();
    }, [selectedSede, yearFrom, yearTo, fertilizanteCalculos, fertilizanteCalculosReport]);


    const handleClickReport = useCallback(async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10,},
            {header: "TIPO", key: "clase", width: 15,},
            {header: "FERTILIZANTE", key: "tipoFertilizante", width: 40,},
            {header: "CANTIDAD", key: "cantidad", width: 15,},
            {header: "NITRÓGENO %", key: "porcentajeNit", width: 20,},
            {header: "FICHA TECNICA", key: "is_ficha", width: 15,},
            {header: "AÑO", key: "anio", width: 15,},
            {header: "SEDE", key: "sede", width: 20,}
        ];
        const data = await fertilizanteCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period), "REPORTE DE EMIIONES DE FERTILIZANTES", "FERTILIZANTES");
    }, [fertilizanteCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (fertilizanteCalculos.isLoading || fertilizanteCalculosReport.isLoading || sedes.isLoading) {
        return <SkeletonTable/>;
    }

    if (fertilizanteCalculos.isError || fertilizanteCalculosReport.isError || sedes.isError) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex gap-4 items-center">
                    <ButtonBack onClick={handleFertilizante}/>
                    <div className="font-Manrope">
                        <h1 className="text-base text-foreground font-bold">
                            Cálculo de emisiones por fertilizantes
                        </h1>
                        <h2 className="text-xs sm:text-sm text-muted-foreground">
                            Huella de carbono
                        </h2>
                    </div>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center w-1/2">
                        <SelectFilter
                            list={sedes.data!}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            icon={<Building className="h-3 w-3"/>}
                        />

                        <ReportComponent
                            onSubmit={handleClickReport}
                            ref={submitFormRef}
                            yearFrom={yearFrom}
                            yearTo={yearTo}
                            handleYearFromChange={handleYearFromChange}
                            handleYearToChange={handleYearToChange}
                        />

                    </div>
                    <ButtonCalculate
                        onClick={handleCalculate}
                        variant="default"
                        text="Calcular"
                    />
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TIPO DE COMBUSTIBLE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                UNIDAD
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                PORCENTAJE NITROGENO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                CANTIDAD DE APORTE DE NITROGENO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TOTAL DE EMISIONES DIRECTAS DE N2O
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES GEI
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fertilizanteCalculos.data!.data.map(
                            (FertilizanteCalculate: FertilizanteCalcResponse) => (
                                <TableRow
                                    className="text-center"
                                    key={FertilizanteCalculate.id}
                                >
                                    <TableCell className="text-xs sm:text-sm text-start">
                                        {FertilizanteCalculate.tipoFertilizante}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">
                                            {FertilizanteCalculate.consumo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.unidad}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.porcentajeNitrogeno}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {FertilizanteCalculate.cantidadAporte}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.totalEmisionesDirectas}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {FertilizanteCalculate.emisionGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
