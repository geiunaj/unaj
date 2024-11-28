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
    useTaxiCalculos,
    useTaxiCalculosReport,
} from "@/components/taxi/lib/taxiCalculos.hooks";
import {createCalculosTaxi} from "@/components/taxi/service/taxiCalculos.actions";
import {
    taxiCalculosCollectionItem,
    FactoresEmision
} from "@/components/taxi/service/taxiCalculos.interface";
import GenerateReport from "@/lib/utils/generateReport";
import SelectFilter from "@/components/SelectFilter";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import ButtonCalculate from "@/components/ButtonCalculate";
import {formatPeriod} from "@/lib/utils/core.function";
import {ReportRequest} from "@/lib/interfaces/globals";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import usePageTitle from "@/lib/stores/titleStore.store";
import {ChangeTitle} from "@/components/TitleUpdater";

export default function TaxiCalculate() {
    ChangeTitle("Cálculos de Taxis");
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [page, setPage] = useState<number>(1);
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const taxiCalculos = useTaxiCalculos({
        from: from ? from : undefined,
        to: to ? to : undefined,
        page: page,
    });

    const conusmoAguaCalculosReport = useTaxiCalculosReport({
        from,
        to,
        page,
    });
    const anios = useQuery({
        queryKey: ["aniosTC"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    })

    // HANDLES
    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleCalculate = useCallback(async () => {
        await createCalculosTaxi({
            from,
            to,
        });
        taxiCalculos.refetch();
        taxiCalculosReport.refetch();
    }, [from, to, taxiCalculos, conusmoAguaCalculosReport]);

    const handleTaxi = () => {
        push("/taxi");
    };

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await taxiCalculos.refetch();
            await taxiCalculosReport.refetch();
        },
        [taxiCalculos, conusmoAguaCalculosReport]
    );

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await taxiCalculos.refetch();
            await taxiCalculosReport.refetch();
        },
        [taxiCalculos, conusmoAguaCalculosReport]
    );

    const handlePageChange = useCallback(
        async (page: number) => {
            await setPage(page);
            await taxiCalculos.refetch();
        },
        [taxiCalculos]
    );

    const taxiCalculosReport = useTaxiCalculosReport({
        from,
        to,
    });

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "SEDE", key: "sede", width: 20},
            {header: "CONSUMO TOTAL", key: "consumo", width: 25},
            {header: "FACTOR EMISIÓN", key: "factoresEmisionString", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await taxiCalculosReport.refetch();
        await GenerateReport(
            data.data!.data,
            columns,
            formatPeriod(period, true),
            `REPORTE DE CALCULOS DE TAXIS`,
            "taxis"
        );
    };

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (
        taxiCalculos.isLoading ||
        anios.isLoading ||
        taxiCalculos.isLoading ||
        conusmoAguaCalculosReport.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        taxiCalculos.isError ||
        anios.isError ||
        taxiCalculos.isError ||
        conusmoAguaCalculosReport.isError
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
                            <ButtonBack onClick={handleTaxi}/>
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
                                data={taxiCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE TAXIS_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "SEDE", key: "sede", width: 25},
                                    {header: "CONSUMO TOTAL", key: "consumo", width: 15},
                                    {header: "FACTOR EMISIÓN", key: "factoresEmisionString", width: 35},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 20},
                                ]}
                                title="REPORTE DE CALCULOS DE TAXIS"
                                rows={25}
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
                        {taxiCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {taxiCalculos.data!.data.map(
                            (taxiCalculosItem: taxiCalculosCollectionItem) => (
                                <TableRow
                                    className="text-center"
                                    key={taxiCalculosItem.id}
                                >
                                    <TableCell className="text-xs sm:text-sm">
                                        {taxiCalculosItem.sede}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="outline">
                                            {taxiCalculosItem.consumo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {taxiCalculosItem.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {taxiCalculosItem.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {taxiCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={taxiCalculos.data!.meta}
                        onPageChange={handlePageChange}
                    />
                )

                }
            </div>
        </div>
    );
}
  
