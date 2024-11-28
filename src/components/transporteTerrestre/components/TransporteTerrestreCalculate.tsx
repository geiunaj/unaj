"use client";
import React, {useState, useCallback, useRef, useEffect} from "react";
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
    useTransporteTerrestreCalculos,
    useTransporteTerrestreCalculosReport,
} from "@/components/transporteTerrestre/lib/transporteTerrestreCalculos.hooks";
import {
    createCalculosTransporteTerrestre
} from "@/components/transporteTerrestre/service/transporteTerrestreCalculos.actions";
import {
    transporteTerrestreCalculosCollectionItem,
    FactoresEmision
} from "@/components/transporteTerrestre/service/transporteTerrestreCalculos.interface";
import GenerateReport from "@/lib/utils/generateReport";
import SelectFilter from "@/components/SelectFilter";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import ButtonCalculate from "@/components/ButtonCalculate";
import {formatPeriod} from "@/lib/utils/core.function";
import {ReportRequest} from "@/lib/interfaces/globals";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getSedes} from "@/components/sede/services/sede.actions";
import usePageTitle from "@/lib/stores/titleStore.store";
import {ChangeTitle} from "@/components/TitleUpdater";

export default function TransporteTerrestreCalculate() {
    ChangeTitle("Cálculos de Transporte Terrestre");

    // NAVIGATION
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [page, setPage] = useState<number>(1);
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const transporteTerrestreCalculos = useTransporteTerrestreCalculos({
        from: from ? from : undefined,
        to: to ? to : undefined,
        page: page,
    });

    const transporteTerrestreCalculosReport = useTransporteTerrestreCalculosReport({
        from,
        to,
    });

    const anios = useQuery({
        queryKey: ["aniosTAC"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    })

    // HANDLES
    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleCalculate = useCallback(async () => {
        await createCalculosTransporteTerrestre({
            from,
            to,
        });
        transporteTerrestreCalculos.refetch();
        transporteTerrestreCalculosReport.refetch();
    }, [from, to, transporteTerrestreCalculos, transporteTerrestreCalculosReport]);

    const handleTransporteTerrestre = () => {
        push("/transporte-terrestre");
    };

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await transporteTerrestreCalculos.refetch();
            await transporteTerrestreCalculosReport.refetch();
        },
        [transporteTerrestreCalculos, transporteTerrestreCalculosReport]
    );

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await transporteTerrestreCalculos.refetch();
            await transporteTerrestreCalculosReport.refetch();
        },
        [transporteTerrestreCalculos, transporteTerrestreCalculosReport]
    );

    const handlePageChange = useCallback(
        async (page: number) => {
            await setPage(page);
            await transporteTerrestreCalculos.refetch();
        },
        [transporteTerrestreCalculos]
    );

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "SEDE", key: "sede", width: 20},
            {header: "CONSUMO TOTAL", key: "consumo", width: 25},
            {header: "FACTOR DE EMISIÓN", key: "factoresEmisionString", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await transporteTerrestreCalculosReport.refetch();
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
        transporteTerrestreCalculos.isLoading ||
        anios.isLoading ||
        transporteTerrestreCalculos.isLoading ||
        transporteTerrestreCalculosReport.isLoading ||
        transporteTerrestreCalculosReport.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        transporteTerrestreCalculos.isError ||
        anios.isError ||
        transporteTerrestreCalculos.isError ||
        transporteTerrestreCalculosReport.isError ||
        transporteTerrestreCalculosReport.isError
    ) {
        return <div>Error</div>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-start mb-6">
                <div className="flex flex-col items-end w-full gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full gap-2 sm:flex sm:justify-between justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-start sm:items-center">
                            <ButtonBack onClick={handleTransporteTerrestre}/>
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
                                data={transporteTerrestreCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE CONSUMO DE ENERGÍA_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "SEDE", key: "sede", width: 25},
                                    {header: "CONSUMO TOTAL", key: "consumo", width: 15},
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
                                SEDE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO <span className="text-[10px]">[km]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FACTOR DE <br/> EMISIÓN <span className="text-[10px]">[kgCO2/km]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TOTAL EMISIONES <br/> GEI <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transporteTerrestreCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {transporteTerrestreCalculos.data!.data.map(
                            (transporteTerrestreCalculosItem: transporteTerrestreCalculosCollectionItem) => (
                                <TableRow
                                    className="text-center"
                                    key={transporteTerrestreCalculosItem.id}
                                >
                                    <TableCell className="text-xs sm:text-sm">
                                        {transporteTerrestreCalculosItem.sede}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="outline">
                                            {transporteTerrestreCalculosItem.consumo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {transporteTerrestreCalculosItem.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {transporteTerrestreCalculosItem.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {transporteTerrestreCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={transporteTerrestreCalculos.data!.meta}
                        onPageChange={handlePageChange}
                    />
                )

                }
            </div>
        </div>
    );
}
  
