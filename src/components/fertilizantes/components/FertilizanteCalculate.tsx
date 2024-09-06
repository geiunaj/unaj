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
import {Building, FileSpreadsheet} from "lucide-react";
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
import {Button} from "@/components/ui/button";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";

export default function FertilizanteCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState(1);

    const [yearFrom, setYearFrom] = useState<string>(new Date().getFullYear().toString());
    const [yearTo, setYearTo] = useState<string>(new Date().getFullYear().toString());

    // HOOKS
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


    const handleClickExcelReport = useCallback(async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "FERTILIZANTE", key: "tipoFertilizante", width: 30},
            {header: "SEDE", key: "sede", width: 20},
            {header: "CONSUMO", key: "consumo", width: 25},
            {header: "UNIDAD", key: "unidad", width: 15},
            {header: "NITRÓGENO[%]", key: "porcentajeNitrogeno", width: 20},
            {header: "APORTE NITRÓGENO", key: "cantidadAporte", width: 25},
            {header: "EMISIONES DE N20", key: "totalEmisionesDirectas", width: 25},
            {header: "TOTAL GEI", key: "emisionGEI", width: 20},
            
        ];
        await setYearFrom(period.yearFrom ?? "");
        await setYearTo(period.yearTo ?? "");
        const data = await fertilizanteCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period), "REPORTE DE EMISIONES DE FERTILIZANTES", "Fertilizantes");
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
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="flex gap-4 items-center">
                    <ButtonBack onClick={handleFertilizante}/>
                    <div className="font-Manrope">
                        <h1 className="text-base text-foreground font-bold">
                            Emisiones de Fertilizantes
                        </h1>
                        <h2 className="text-xs sm:text-sm text-muted-foreground">
                            Huella de carbono
                        </h2>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full sm:flex sm:flex-col sm:justify-end sm:items-end gap-1 justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-end sm:items-center">
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
                                onSubmit={handleClickExcelReport}
                                ref={submitFormRef}
                                yearFrom={yearFrom}
                                yearTo={yearTo}
                                handleYearFromChange={handleYearFromChange}
                                handleYearToChange={handleYearToChange}
                            />

                        </div>
                        <div className="flex flex-col-reverse justify-end gap-1 w-full sm:flex-row sm:gap-2">
                            <Button
                                onClick={handleClick}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-2 h-7"
                            >
                                <FileSpreadsheet className="h-3.5 w-3.5"/>
                                Excel
                            </Button>

                            <ExportPdfReport
                                data={fertilizanteCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE FERTILIZANTES_${formatPeriod({yearFrom, yearTo}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "FERTILIZANTE", key: "tipoFertilizante", width: 20},
                                    {header: "SEDE", key: "sede", width: 20},
                                    {header: "CONSUMO", key: "consumo", width: 15},
                                    {header: "UNIDAD", key: "unidad", width: 10},
                                    {header: "NITRÓGENO[%]", key: "porcentajeNitrogeno", width: 10},
                                    {header: "APORTE NITRÓGENO", key: "cantidadAporte", width: 15},
                                    {header: "EMISIONES DE N20", key: "totalEmisionesDirectas", width: 15},
                                    {header: "TOTAL GEI", key: "emisionGEI", width: 10},
                                ]}
                                title="REPORTE DE CALCULOS DE FERTILIZANTES"
                                period={formatPeriod({yearFrom, yearTo})}
                            />

                            <ButtonCalculate
                                onClick={handleCalculate}
                                variant="default"
                                text="Calcular"
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FERTILIZANTE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                UNIDAD
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                % NITROGENO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                APORTE DE NITROGENO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES DE N2O
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES GEI
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fertilizanteCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
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
