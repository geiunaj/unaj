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
import ButtonCalculate from "@/components/ButtonCalculate";
import ButtonBack from "@/components/ButtonBack";
import {useRouter} from "next/navigation";
import ReportComponent from "@/components/ReportComponent";
import GenerateReport from "@/lib/utils/generateReport";
import {formatPeriod} from "@/lib/utils/core.function";
import {
    useConsumibleCalculos,
    useConsumibleCalculosReport, useSedes
} from "@/components/consumibles/lib/consumiblesCalculos.hooks";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {createConsumibleCalculate} from "@/components/consumibles/services/consumibleCalculate.actions";
import {ReportRequest} from "@/lib/interfaces/globals";
import {Button} from "@/components/ui/button";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {ConsumibleCalcResponse} from "@/components/consumibles/services/consumibleCalculate.interface";

export default function ConsumiblesCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState(1);

    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const consumibleCalculos = useConsumibleCalculos({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
        page,
    });
    const consumibleCalculosReport = useConsumibleCalculosReport({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
    });

    const sedes = useSedes();

    const handleConsumible = () => {
        push("/consumible");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await consumibleCalculos.refetch();
        await consumibleCalculosReport.refetch();
    }, [consumibleCalculos, consumibleCalculosReport]);

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await consumibleCalculos.refetch();
        await consumibleCalculosReport.refetch();
    }, [consumibleCalculos, consumibleCalculosReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await consumibleCalculos.refetch();
        await consumibleCalculosReport.refetch();
    }, [consumibleCalculos, consumibleCalculosReport]);

    const handleCalculate = useCallback(async () => {
        await createConsumibleCalculate({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from,
            to,
        });
        consumibleCalculos.refetch();
        consumibleCalculosReport.refetch();
    }, [selectedSede, from, to, consumibleCalculos, consumibleCalculosReport]);


    const handleClickExcelReport = useCallback(async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "FERTILIZANTE", key: "tipoConsumible", width: 30},
            {header: "SEDE", key: "sede", width: 20},
            {header: "CONSUMO", key: "consumo", width: 25},
            {header: "UNIDAD", key: "unidad", width: 15},
            {header: "NITRÓGENO[%]", key: "porcentajeNitrogeno", width: 20},
            {header: "APORTE NITRÓGENO", key: "cantidadAporte", width: 25},
            {header: "EMISIONES DE N20", key: "totalEmisionesDirectas", width: 25},
            {header: "TOTAL GEI", key: "emisionGEI", width: 20},

        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await consumibleCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period), "REPORTE DE EMISIONES DE FERTILIZANTES", "Consumibles");
    }, [consumibleCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (consumibleCalculos.isLoading || consumibleCalculosReport.isLoading || sedes.isLoading) {
        return <SkeletonTable/>;
    }

    if (consumibleCalculos.isError || consumibleCalculosReport.isError || sedes.isError) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="flex gap-4 items-center">
                    <ButtonBack onClick={handleConsumible}/>
                    <div className="font-Manrope">
                        <h1 className="text-base text-foreground font-bold">
                            Emisiones de Consumibles
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
                                from={from}
                                to={to}
                                withMonth={true}
                                handleFromChange={handleFromChange}
                                handleToChange={handleToChange}
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
                                data={consumibleCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE FERTILIZANTES_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "FERTILIZANTE", key: "tipoConsumible", width: 20},
                                    {header: "SEDE", key: "sede", width: 20},
                                    {header: "CONSUMO", key: "consumo", width: 15},
                                    {header: "UNIDAD", key: "unidad", width: 10},
                                    {header: "NITRÓGENO[%]", key: "porcentajeNitrogeno", width: 10},
                                    {header: "APORTE NITRÓGENO", key: "cantidadAporte", width: 15},
                                    {header: "EMISIONES DE N20", key: "totalEmisionesDirectas", width: 15},
                                    {header: "TOTAL GEI", key: "emisionGEI", width: 10},
                                ]}
                                title="REPORTE DE CALCULOS DE FERTILIZANTES"
                                period={formatPeriod({from, to})}
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
                        {consumibleCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {consumibleCalculos.data!.data.map(
                            (ConsumibleCalculate: ConsumibleCalcResponse) => (
                                <TableRow
                                    className="text-center"
                                    key={ConsumibleCalculate.id}
                                >
                                    <TableCell className="text-xs sm:text-sm text-start">
                                        {ConsumibleCalculate.tipoConsumible}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">
                                            {ConsumibleCalculate.categoria}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {ConsumibleCalculate.unidad}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {ConsumibleCalculate.grupo}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {ConsumibleCalculate.proceso}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {ConsumibleCalculate.pesoTotal}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {ConsumibleCalculate.totalGEI}
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
