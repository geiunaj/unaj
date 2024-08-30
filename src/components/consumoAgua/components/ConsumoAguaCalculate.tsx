"use client";
import React, {useState, useCallback} from "react";
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
import {FileSpreadsheet} from "lucide-react";
import CustomPagination from "@/components/Pagination";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import ReportCalculatePopover, {ReportCalculateRequest} from "@/components/ReportCalculatePopover";
import {
    useConsumoAguaCalculos,
    useConsumoAguaCalculosReport
} from "@/components/consumoAgua/lib/consumoAguaCalculos.hooks";
import {createCalculosConsumoAgua} from "@/components/consumoAgua/services/consumoAguaCalculos.actions";
import {consumoAguaCalculosCollectionItem} from "@/components/consumoAgua/services/consumoAguaCalculos.interface";
import {formatPeriod, ReportRequest} from "@/components/ReportPopover";
import GenerateReport from "@/lib/utils/generateReport";

export default function ConsumoAguaCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    // HOOKS
    const consumoAguaCalculos = useConsumoAguaCalculos({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from: from ? from : undefined,
        to: to ? to : undefined,
        page: page,
    });

    const handleCalculate = useCallback(async (data: ReportCalculateRequest) => {
        await setFrom(data.from || "");
        await setTo(data.to || "");
        await setSelectedSede(data.sedeId || "");
        await createCalculosConsumoAgua({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from: from ? from : undefined,
            to: to ? to : undefined,
        });
        await consumoAguaCalculos.refetch();
    }, [selectedSede, from, to, consumoAguaCalculos]);

    const handleCombustion = () => {
        push("/electricidad");
    };

    const handlePageChange = useCallback(async (page: number) => {
        await setPage(page);
        await consumoAguaCalculos.refetch();
    }, [consumoAguaCalculos]);

    const consumoAguaCalculosReport = useConsumoAguaCalculosReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to
    });

    const handleClickReport = async (period: ReportCalculateRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10,},
            {header: "CONSUMO DE AREA", key: "consumoArea", width: 25,},
            {header: "FACTOR DE EMISIÓN", key: "factorEmision", width: 25,},
            {header: "TOTAL GEI", key: "totalGEI", width: 20,},
            {header: "AREA", key: "area", width: 20,},
            {header: "SEDE", key: "sede", width: 10,},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        await setSelectedSede(period.sedeId ?? "");
        await createCalculosConsumoAgua({
            sedeId: period.sedeId ? Number(period.sedeId) : undefined,
            from: period.from ? period.from : undefined,
            to: period.to ? period.to : undefined
        });
        const data = await consumoAguaCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), `REPORTE DE CALCULOS DE CONSUMO DE AGUA`, "consumo-agua");
    }

    if (consumoAguaCalculos.isLoading) {
        return <SkeletonTable/>;
    }

    if (consumoAguaCalculos.isError) {
        return <div>Error</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex items-center gap-4">
                    <ButtonBack onClick={handleCombustion}/>
                    <div className="font-Manrope">
                        <h1 className="text-base text-foreground font-bold">
                            Cálculo de Consumo de Agua Potable
                        </h1>
                        <h2 className="text-xs sm:text-sm text-muted-foreground">
                            Huella de carbono
                        </h2>
                    </div>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    size="sm"
                                    className="h-7 gap-1"
                                >
                                    <FileSpreadsheet className="h-3.5 w-3.5"/>
                                    Calcular
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <ReportCalculatePopover
                                    onClick={(data: ReportCalculateRequest) => handleCalculate(data)}
                                    onClickExport={(data: ReportRequest) => handleClickReport(data)}
                                />
                            </PopoverContent>
                        </Popover>
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
                        {consumoAguaCalculos.data!.data.map(
                            (consumoAguaCalculosItem: consumoAguaCalculosCollectionItem) => (
                                <TableRow className="text-center" key={consumoAguaCalculosItem.id}>
                                    <TableCell className="text-xs sm:text-sm">
                                        {consumoAguaCalculosItem.area}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {consumoAguaCalculosItem.consumoArea}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {consumoAguaCalculosItem.factorEmision}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {consumoAguaCalculosItem.totalGEI}
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {
                    consumoAguaCalculos.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={consumoAguaCalculos.data!.meta} onPageChange={handlePageChange}/>
                    )
                }
            </div>
        </div>
    );
}
