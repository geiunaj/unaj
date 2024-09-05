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
import SelectFilter from "@/components/SelectFilter";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import ButtonCalculate from "@/components/ButtonCalculate";
import ButtonBack from "@/components/ButtonBack";
import {
    useAnio,
    useElectricidadCalculos, useElectricidadCalculosReport,
    useSede
} from "@/components/consumoElectricidad/lib/electricidadCalculos.hooks";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {electricidadCalculosResource} from "@/components/consumoElectricidad/services/electricidadCalculos.interface";
import {createCalculosElectricidad} from "@/components/consumoElectricidad/services/electricidadCalculos.actions";
import {Building, FileSpreadsheet} from "lucide-react";
import CustomPagination from "@/components/Pagination";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import GenerateReport from "@/lib/utils/generateReport";
import {Button} from "@/components/ui/button";
import {ReportRequest} from "@/lib/interfaces/globals";
import {formatPeriod} from "@/lib/utils/core.function";

export default function ElectricidadCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState<number>(1);

    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const electricidadCalculos = useElectricidadCalculos({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
        page,
    });

    const electricidadCalculosReport = useElectricidadCalculosReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
        page,
    });
    const sedes = useSede();
    const anios = useAnio();

    // HANDLES
    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await electricidadCalculos.refetch();
        await electricidadCalculosReport.refetch();
    }, [electricidadCalculos, electricidadCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleCalculate = useCallback(async () => {
        await createCalculosElectricidad({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from,
            to,
        });
        electricidadCalculos.refetch();
        electricidadCalculosReport.refetch();
    }, [selectedSede, from, to, electricidadCalculos, electricidadCalculosReport]);

    const handleCombustion = () => {
        push("/electricidad");
    };

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await electricidadCalculos.refetch();
        await electricidadCalculosReport.refetch();
    }, [electricidadCalculos, electricidadCalculosReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await electricidadCalculos.refetch();
        await electricidadCalculosReport.refetch();
    }, [electricidadCalculos, electricidadCalculosReport]);

    const handlePageChange = useCallback(async (page: number) => {
        await setPage(page);
        await electricidadCalculos.refetch();
    }, [electricidadCalculos]);

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "AREA", key: "area", width: 20},
            {header: "CONSUMO TOTAL", key: "consumoTotal", width: 20},
            {header: "EMISIONES DE CO2", key: "emisionCO2", width: 25},
            {header: "EMISIONES DE CH4", key: "emisionCH4", width: 25},
            {header: "EMISIONES DE N20", key: "emisionN2O", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await electricidadCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), `REPORTE DE CALCULOS DE CONSUMO DE ELECTRICIDAD`, "ELECTRICIDAD-CALCULOS");
    }

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (electricidadCalculos.isLoading || sedes.isLoading || anios.isLoading || electricidadCalculosReport.isLoading) {
        return <SkeletonTable/>;
    }

    if (electricidadCalculos.isError || sedes.isError || anios.isError || electricidadCalculosReport.isError) {
        return <div>Error</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="flex items-center gap-4">
                    <ButtonBack onClick={handleCombustion}/>
                    <div className="font-Manrope">
                        <h1 className="text-base text-foreground font-bold">Emisiones de Consumo de Electricidad</h1>
                        <h2 className="text-xs sm:text-sm text-muted-foreground">Huella de carbono</h2>
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
                                all={true}
                                icon={<Building className="h-3 w-3"/>}
                            />

                            <ReportComponent
                                onSubmit={handleClickExcelReport}
                                ref={submitFormRef}
                                withMonth={true}
                                from={from}
                                to={to}
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
                                data={electricidadCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE CONSUMO DE ENERGÍA_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "AREA", key: "area", width: 15},
                                    {header: "CONSUMO TOTAL", key: "consumoTotal", width: 15},
                                    {header: "EMISIONES DE CO2", key: "emisionCO2", width: 15},
                                    {header: "EMISIONES DE CH4", key: "emisionCH4", width: 15},
                                    {header: "EMISIONES DE N20", key: "emisionN2O", width: 15},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 15},
                                ]}
                                title="REPORTE DE CALCULOS DE CONSUMO DE ENERGÍA"
                                period={formatPeriod({from, to}, true)}
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
                                AREA
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES DE CO2
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES DE CH4
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES DE N2O
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TOTAL EMISIONES GEI
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {electricidadCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {electricidadCalculos.data!.data.map(
                            (electricidadCalculosResource: electricidadCalculosResource) => (
                                <TableRow className="text-center" key={electricidadCalculosResource.id}>
                                    <TableCell className="text-xs sm:text-sm text-start">
                                        {electricidadCalculosResource.area}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">
                                            {electricidadCalculosResource.consumoTotal}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {electricidadCalculosResource.emisionCO2}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {electricidadCalculosResource.emisionCH4}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {electricidadCalculosResource.emisionN2O}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {electricidadCalculosResource.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {
                    electricidadCalculos.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={electricidadCalculos.data!.meta} onPageChange={handlePageChange}/>
                    )
                }
            </div>
        </div>
    );
}
