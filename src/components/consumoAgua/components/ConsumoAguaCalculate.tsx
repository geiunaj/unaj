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
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import ButtonBack from "@/components/ButtonBack";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {Building, FileSpreadsheet} from "lucide-react";
import CustomPagination from "@/components/Pagination";
import {Button} from "@/components/ui/button";
import {
    useConsumoAguaCalculos,
    useConsumoAguaCalculosReport,
} from "@/components/consumoAgua/lib/consumoAguaCalculos.hooks";
import {createCalculosConsumoAgua} from "@/components/consumoAgua/services/consumoAguaCalculos.actions";
import {
    consumoAguaCalculosCollectionItem,
    FactoresEmision
} from "@/components/consumoAgua/services/consumoAguaCalculos.interface";
import GenerateReport from "@/lib/utils/generateReport";
import {useAnio, useSede} from "../lib/consumoAgua.hooks";
import SelectFilter from "@/components/SelectFilter";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import ButtonCalculate from "@/components/ButtonCalculate";
import {formatPeriod} from "@/lib/utils/core.function";
import {ReportRequest} from "@/lib/interfaces/globals";

export default function ConsumoAguaCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState<number>(1);
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const consumoAguaCalculos = useConsumoAguaCalculos({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from: from ? from : undefined,
        to: to ? to : undefined,
        page: page,
    });

    const conusmoAguaCalculosReport = useConsumoAguaCalculosReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
        page,
    });
    const sedes = useSede();
    const anios = useAnio();

    // HANDLES

    const handleSedeChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedSede(value);
            await consumoAguaCalculos.refetch();
            await consumoAguaCalculos.refetch();
        },
        [consumoAguaCalculos, conusmoAguaCalculosReport]
    );

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleCalculate = useCallback(async () => {
        await createCalculosConsumoAgua({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from,
            to,
        });
        consumoAguaCalculos.refetch();
        consumoAguaCalculosReport.refetch();
    }, [selectedSede, from, to, consumoAguaCalculos, conusmoAguaCalculosReport]);

    const handleConsumoAgua = () => {
        push("/consumo-agua");
    };

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await consumoAguaCalculos.refetch();
            await consumoAguaCalculosReport.refetch();
        },
        [consumoAguaCalculos, conusmoAguaCalculosReport]
    );

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await consumoAguaCalculos.refetch();
            await consumoAguaCalculosReport.refetch();
        },
        [consumoAguaCalculos, conusmoAguaCalculosReport]
    );

    const handlePageChange = useCallback(
        async (page: number) => {
            await setPage(page);
            await consumoAguaCalculos.refetch();
        },
        [consumoAguaCalculos]
    );

    const consumoAguaCalculosReport = useConsumoAguaCalculosReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
    });

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "AREA", key: "area", width: 20},
            {header: "CONSUMO TOTAL", key: "consumoArea", width: 25},
            {header: "FACTOR DE EMISIÓN", key: "factoresEmisionString", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await consumoAguaCalculosReport.refetch();
        await GenerateReport(
            data.data!.data,
            columns,
            formatPeriod(period, true),
            `REPORTE DE CALCULOS DE CONSUMO DE AGUA`,
            "consumo-agua"
        );
    };

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (
        consumoAguaCalculos.isLoading ||
        sedes.isLoading ||
        anios.isLoading ||
        consumoAguaCalculos.isLoading ||
        conusmoAguaCalculosReport.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        consumoAguaCalculos.isError ||
        sedes.isError ||
        anios.isError ||
        consumoAguaCalculos.isError ||
        conusmoAguaCalculosReport.isError
    ) {
        return <div>Error</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex items-center gap-4">
                    <ButtonBack onClick={handleConsumoAgua}/>
                    <div className="font-Manrope">
                        <h1 className="text-base text-foreground font-bold">
                            Cálculo de Consumo de Agua Potable
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
                                data={consumoAguaCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE CONSUMO DE ENERGÍA_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "AREA", key: "area", width: 25},
                                    {header: "CONSUMO TOTAL", key: "consumoArea", width: 15},
                                    {header: "FACTOR DE EMISIÓN", key: "factoresEmisionString", width: 35},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 20},
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
                                FACTOR DE EMISIÓN
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TOTAL EMISIONES GEI
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consumoAguaCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {consumoAguaCalculos.data!.data.map(
                            (consumoAguaCalculosItem: consumoAguaCalculosCollectionItem) => (
                                <TableRow
                                    className="text-center"
                                    key={consumoAguaCalculosItem.id}
                                >
                                    <TableCell className="text-xs sm:text-sm">
                                        {consumoAguaCalculosItem.area}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {consumoAguaCalculosItem.consumoArea}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {consumoAguaCalculosItem.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {consumoAguaCalculosItem.totalGEI}
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {consumoAguaCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={consumoAguaCalculos.data!.meta}
                        onPageChange={handlePageChange}
                    />
                )

                }
            </div>
        </div>
    );
}
  
