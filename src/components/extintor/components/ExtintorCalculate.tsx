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
    useExtintorCalculos,
    useExtintorCalculosReport,
} from "@/components/extintor/lib/extintorCalculos.hooks";
import {
    createCalculosExtintor
} from "@/components/extintor/service/extintorCalculos.actions";
import {
    ExtintorCalculosCollectionItem,
    FactoresEmision
} from "@/components/extintor/service/extintorCalculos.interface";
import GenerateReport from "@/lib/utils/generateReport";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import ButtonCalculate from "@/components/ButtonCalculate";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import {ReportRequest} from "@/lib/interfaces/globals";
import {useQuery} from "@tanstack/react-query";
import {getAnio} from "@/components/anio/services/anio.actions";
import {ChangeTitle} from "@/components/TitleUpdater";
import {getSedes} from "@/components/sedes/services/sedes.actions";
import SelectFilter from "@/components/SelectFilter";

export default function ExtintorCalculate() {
    ChangeTitle("Cálculo de Extintores");

    // NAVIGATION
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [page, setPage] = useState<number>(1);
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const extintorCalculos = useExtintorCalculos({
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        from: from ? from : undefined,
        to: to ? to : undefined,
        page: page,
    });

    const extintorCalculosReport = useExtintorCalculosReport({
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        from,
        to,
    });

    const anios = useQuery({
        queryKey: ["aniosTAC"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    })

    const sedes = useQuery({
        queryKey: ["sedesTAC"],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    })

    // HANDLES
    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleCalculate = useCallback(async () => {
        await createCalculosExtintor({
            sedeId: selectedSede ? parseInt(selectedSede) : undefined,
            from,
            to,
        }).then(() => {
            successToast("Emisiones de Extintores Calculadas");
        }).catch((error: any) => {
            errorToast(error.response.data.message);
        });
        extintorCalculos.refetch();
        extintorCalculosReport.refetch();
    }, [from, to, extintorCalculos, extintorCalculosReport]);

    const handleExtintor = () => {
        push("/extintor");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await extintorCalculos.refetch();
        await extintorCalculosReport.refetch();
    }, [extintorCalculos, extintorCalculosReport]);

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await extintorCalculos.refetch();
            await extintorCalculosReport.refetch();
        },
        [extintorCalculos, extintorCalculosReport]
    );

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await extintorCalculos.refetch();
            await extintorCalculosReport.refetch();
        },
        [extintorCalculos, extintorCalculosReport]
    );

    const handlePageChange = useCallback(
        async (page: number) => {
            await setPage(page);
            await extintorCalculos.refetch();
        },
        [extintorCalculos]
    );

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "rn", width: 10},
            {header: "SEDE", key: "sede", width: 15},
            {header: "TIPO DE EXTINTOR", key: "tipoExtintor", width: 20},
            {header: "CONSUMO TOTAL", key: "consumoTotal", width: 25},
            {header: "FACTOR DE EMISIÓN", key: "factoresEmisionString", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await extintorCalculosReport.refetch();
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
        extintorCalculos.isLoading ||
        anios.isLoading ||
        sedes.isLoading ||
        extintorCalculos.isLoading ||
        extintorCalculosReport.isLoading ||
        extintorCalculosReport.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        extintorCalculos.isError ||
        anios.isError ||
        sedes.isError ||
        extintorCalculos.isError ||
        extintorCalculosReport.isError ||
        extintorCalculosReport.isError
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
                            <ButtonBack onClick={handleExtintor}/>

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
                                data={extintorCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE EXTINTOR_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 5},
                                    {header: "SEDE", key: "sede", width: 10},
                                    {header: "TIPO DE EXTINTOR", key: "tipoExtintor", width: 25},
                                    {header: "CONSUMO TOTAL", key: "consumoTotal", width: 15},
                                    {header: "FACTOR DE EMISIÓN", key: "factoresEmisionString", width: 25},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 20},
                                ]}
                                title="REPORTE DE CALCULOS DE EXTINTOR"
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
                                TIPO DE EXTINTOR
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO <span className="text-[10px]">[kg]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FACTOR DE <br/>EMISIÓN <span className="text-[10px]">[kgCO2/kg]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TOTAL EMISIONES <br/> GEI <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {extintorCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {extintorCalculos.data!.data.map(
                            (extintorCalculosItem: ExtintorCalculosCollectionItem) => (
                                <TableRow
                                    className="text-center"
                                    key={extintorCalculosItem.rn}
                                >
                                    <TableCell className="text-xs sm:text-sm">
                                        {extintorCalculosItem.tipoExtintor}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="outline">
                                            {extintorCalculosItem.consumoTotal}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {extintorCalculosItem.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {extintorCalculosItem.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {extintorCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={extintorCalculos.data!.meta}
                        onPageChange={handlePageChange}
                    />
                )

                }
            </div>
        </div>
    );
}
  
