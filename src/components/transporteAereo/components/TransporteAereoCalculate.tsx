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
    useTransporteAereoCalculos,
    useTransporteAereoCalculosReport,
} from "@/components/transporteAereo/lib/transporteAereoCalculos.hooks";
import {createCalculosTransporteAereo} from "@/components/transporteAereo/service/transporteAereoCalculos.actions";
import {
    transporteAereoCalculosCollectionItem,
    FactoresEmision
} from "@/components/transporteAereo/service/transporteAereoCalculos.interface";
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
import {ChangeTitle} from "@/components/TitleUpdater";

export default function TransporteAereoCalculate() {
    ChangeTitle("Cálculos de Transporte Aéreo");

    // NAVIGATION
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [page, setPage] = useState<number>(1);
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");
    const [selectedSede, setSelectedSede] = useState<string>("1");

    // HOOKS
    const transporteAereoCalculos = useTransporteAereoCalculos({
        from: from ? from : undefined,
        to: to ? to : undefined,
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        page: page,
    });

    const transporteAereoCalculosReport = useTransporteAereoCalculosReport({
        from,
        to,
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
    });

    const conusmoAguaCalculosReport = useTransporteAereoCalculosReport({
        from,
        to,
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        page,
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
        await createCalculosTransporteAereo({
            from,
            to,
            sedeId: selectedSede ? Number(selectedSede) : undefined,
        });
        transporteAereoCalculos.refetch();
        transporteAereoCalculosReport.refetch();
    }, [selectedSede, from, to, transporteAereoCalculos, conusmoAguaCalculosReport]);

    const handleTransporteAereo = () => {
        push("/transporte-aereo");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await transporteAereoCalculos.refetch();
        await transporteAereoCalculosReport.refetch();
    }, [transporteAereoCalculos, transporteAereoCalculosReport]);

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await transporteAereoCalculos.refetch();
            await transporteAereoCalculosReport.refetch();
        },
        [transporteAereoCalculos, conusmoAguaCalculosReport]
    );

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await transporteAereoCalculos.refetch();
            await transporteAereoCalculosReport.refetch();
        },
        [transporteAereoCalculos, conusmoAguaCalculosReport]
    );

    const handlePageChange = useCallback(
        async (page: number) => {
            await setPage(page);
            await transporteAereoCalculos.refetch();
        },
        [transporteAereoCalculos]
    );

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 5},
            {header: "INTERVALO", key: "intervalo", width: 30},
            {header: "SEDE", key: "sede", width: 30},
            {header: "CONSUMO TOTAL", key: "consumo", width: 15},
            {header: "FACTOR EMISIÓN", key: "factoresEmisionString", width: 40},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await transporteAereoCalculosReport.refetch();
        await GenerateReport(
            data.data!.data,
            columns,
            formatPeriod(period, true),
            `REPORTE DE CALCULOS DE CONSUMO DE AGUA`,
            "consumo-agua"
        );
    };

    const intervaloName = (intervalo: string): string => {
        switch (intervalo) {
            case "1600":
                return "Menor a 1600";
            case "1600_3700":
                return "Entre 1600 y 3700";
            case "3700":
                return "Mayor a 3700";
            default:
                return "No definido";
        }
    }

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (
        transporteAereoCalculos.isLoading ||
        anios.isLoading ||
        transporteAereoCalculos.isLoading ||
        conusmoAguaCalculosReport.isLoading ||
        sedes.isLoading ||
        transporteAereoCalculosReport.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        transporteAereoCalculos.isError ||
        anios.isError ||
        transporteAereoCalculos.isError ||
        conusmoAguaCalculosReport.isError ||
        sedes.isError ||
        transporteAereoCalculosReport.isError
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
                            <ButtonBack onClick={handleTransporteAereo}/>
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
                                data={transporteAereoCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE CONSUMO DE ENERGÍA_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 5},
                                    {header: "INTERVALO", key: "intervalo", width: 20},
                                    {header: "SEDE", key: "sede", width: 20},
                                    {header: "CONSUMO TOTAL", key: "consumo", width: 15},
                                    {header: "FACTOR EMISIÓN", key: "factoresEmisionString", width: 20},
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
                                INTERVALO
                            </TableHead>
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
                        {transporteAereoCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {transporteAereoCalculos.data!.data.map(
                            (transporteAereoCalculosItem: transporteAereoCalculosCollectionItem) => (
                                <TableRow
                                    className="text-center"
                                    key={transporteAereoCalculosItem.id}
                                >
                                    <TableCell className="text-xs text-start sm:text-sm">
                                        {intervaloName(transporteAereoCalculosItem.intervalo)}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {transporteAereoCalculosItem.sede}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="outline">
                                            {transporteAereoCalculosItem.consumo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {transporteAereoCalculosItem.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {transporteAereoCalculosItem.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {transporteAereoCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={transporteAereoCalculos.data!.meta}
                        onPageChange={handlePageChange}
                    />
                )

                }
            </div>
        </div>
    );
}
  
