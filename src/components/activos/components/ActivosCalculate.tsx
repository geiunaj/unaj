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
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import {
    useActivoCalculos,
    useActivoCalculosReport, useSedes
} from "@/components/activos/lib/activoCalculos.hooks";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {createActivoCalculate} from "@/components/activos/services/activosCalculate.actions";
import {ReportRequest} from "@/lib/interfaces/globals";
import {Button} from "@/components/ui/button";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {ActivoCalcResponse} from "@/components/activos/services/activosCalculate.interface";
import CustomPagination from "@/components/Pagination";
import {FactoresEmision} from "@/components/consumoAgua/services/consumoAguaCalculos.interface";
import {ChangeTitle} from "@/components/TitleUpdater";

export default function ActivosCalculate() {
    ChangeTitle("Calculo de Activos Fijos");
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState(1);

    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const activoCalculos = useActivoCalculos({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
        page,
    });
    const activoCalculosReport = useActivoCalculosReport({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
    });

    const sedes = useSedes();

    const handleActivo = () => {
        push("/activos-fijos");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await activoCalculos.refetch();
        await activoCalculosReport.refetch();
    }, [activoCalculos, activoCalculosReport]);

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await activoCalculos.refetch();
        await activoCalculosReport.refetch();
    }, [activoCalculos, activoCalculosReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await activoCalculos.refetch();
        await activoCalculosReport.refetch();
    }, [activoCalculos, activoCalculosReport]);

    const handleCalculate = useCallback(async () => {
        await createActivoCalculate({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from,
            to,
        }).then(() => {
            successToast("Calculo realizado con éxito");
        })
            .catch((error: any) => {
                errorToast(error.response.data.message);
            });
        activoCalculos.refetch();
        activoCalculosReport.refetch();
    }, [selectedSede, from, to, activoCalculos, activoCalculosReport]);


    const handleClickExcelReport = useCallback(async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "rn", width: 10},
            {header: "GRUPO DE ACTIVO", key: "grupoActivo", width: 30},
            {header: "CONSUMO", key: "cantidadTotal", width: 20},
            {header: "SEDE", key: "sede", width: 20},
            {header: "FACTORES", key: "factoresEmisionString", width: 20},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await activoCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), "REPORTE DE EMISIONES DE ACTIVOS", "Activos");
    }, [activoCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await activoCalculos.refetch();
    };

    if (activoCalculos.isLoading || activoCalculosReport.isLoading || sedes.isLoading) {
        return <SkeletonTable/>;
    }

    if (activoCalculos.isError || activoCalculosReport.isError || sedes.isError) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-start mb-6">
                <div className="flex flex-col items-end w-full gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full gap-2 sm:flex sm:justify-between justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-start sm:items-center">
                            <ButtonBack onClick={handleActivo}/>
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
                                data={activoCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE ACTIVOS_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 10},
                                    {header: "GRUPO DE ACTIVO", key: "grupoActivo", width: 20},
                                    {header: "CONSUMO", key: "cantidadTotal", width: 10},
                                    {header: "SEDE", key: "sede", width: 20},
                                    {header: "FACTORES", key: "factoresEmisionString", width: 20},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 20},
                                ]}
                                title="REPORTE DE CALCULOS DE ACTIVOS"
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
                            <TableHead className="text-xs font-bold text-center">
                                SEDE
                            </TableHead>
                            <TableHead
                                className="text-xs whitespace-nowrap overflow-hidden text-ellipsis font-bold text-center">
                                GRUPO DE ACTIVO
                            </TableHead>
                            <TableHead
                                className="text-xs whitespace-nowrap overflow-hidden text-ellipsis font-bold text-center">
                                CONSUMO <span className="text-[10px]">[kg]</span>
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                FACTOR DE <br/> EMISIÓN <span className="text-[10px]">[kgCO2/kg]</span>
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                TOTAL EMISIONES <br/>GEI <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activoCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {activoCalculos.data!.data.map(
                            (ActivoCalculate: ActivoCalcResponse) => (
                                <TableRow
                                    className="text-center"
                                    key={ActivoCalculate.id}
                                >
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {ActivoCalculate.sede}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {ActivoCalculate.grupoActivo}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {ActivoCalculate.cantidadTotal}
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {ActivoCalculate.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Badge variant="default">
                                            {ActivoCalculate.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {activoCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={activoCalculos.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>
        </div>
    );
}
