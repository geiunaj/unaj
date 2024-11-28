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
    useTransporteCasaTrabajoCalculos,
    useTransporteCasaTrabajoCalculosReport, useSedes
} from "@/components/transporteCasaTrabajo/lib/transporteCasaTrabajoCalculos.hooks";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    createTransporteCasaTrabajoCalculate
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajoCalculate.actions";
import {ReportRequest} from "@/lib/interfaces/globals";
import {Button} from "@/components/ui/button";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {
    TransporteCasaTrabajoCalcResponse
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajoCalculate.interface";
import CustomPagination from "@/components/Pagination";
import {FactoresEmision} from "@/components/consumoAgua/services/consumoAguaCalculos.interface";

export default function TransporteCasaTrabajoCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState(1);

    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const transporteCasaTrabajoCalculos = useTransporteCasaTrabajoCalculos({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
        page,
    });
    const transporteCasaTrabajoCalculosReport = useTransporteCasaTrabajoCalculosReport({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
    });

    const sedes = useSedes();

    const handleTransporteCasaTrabajo = () => {
        push("/transporte-casa-trabajo");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await transporteCasaTrabajoCalculos.refetch();
        await transporteCasaTrabajoCalculosReport.refetch();
    }, [transporteCasaTrabajoCalculos, transporteCasaTrabajoCalculosReport]);

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await transporteCasaTrabajoCalculos.refetch();
        await transporteCasaTrabajoCalculosReport.refetch();
    }, [transporteCasaTrabajoCalculos, transporteCasaTrabajoCalculosReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await transporteCasaTrabajoCalculos.refetch();
        await transporteCasaTrabajoCalculosReport.refetch();
    }, [transporteCasaTrabajoCalculos, transporteCasaTrabajoCalculosReport]);

    const handleCalculate = useCallback(async () => {
        await createTransporteCasaTrabajoCalculate({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from,
            to,
        }).then(() => {
            successToast("Calculo realizado con éxito");
        })
            .catch((error: any) => {
                errorToast(error.response.data.message);
            });
        transporteCasaTrabajoCalculos.refetch();
        transporteCasaTrabajoCalculosReport.refetch();
    }, [selectedSede, from, to, transporteCasaTrabajoCalculos, transporteCasaTrabajoCalculosReport]);


    const handleClickExcelReport = useCallback(async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "SEDE", key: "sede", width: 20},
            {header: "TIPO VEHICULO", key: "tipoVehiculo", width: 30},
            {header: "FACTOR EMISIÓN", key: "factoresEmisionString", width: 30},
            {header: "TOTAL GEI", key: "totalGEI", width: 20},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await transporteCasaTrabajoCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), "REPORTE DE EMISIONES DE TRANSPORTE CASA TRABAJO", "TransporteCasaTrabajos");
    }, [transporteCasaTrabajoCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await transporteCasaTrabajoCalculos.refetch();
    };

    if (transporteCasaTrabajoCalculos.isLoading || transporteCasaTrabajoCalculosReport.isLoading || sedes.isLoading) {
        return <SkeletonTable/>;
    }

    if (transporteCasaTrabajoCalculos.isError || transporteCasaTrabajoCalculosReport.isError || sedes.isError) {
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
                            <ButtonBack onClick={handleTransporteCasaTrabajo}/>
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
                                data={transporteCasaTrabajoCalculosReport.data!.data}
                                fileName={`REPORTE CALCULOS DE TRANSPORTE CASA TRABAJO_${formatPeriod({
                                    from,
                                    to
                                }, true)}`}
                                columns={[
                                    {header: "N°", key: "id", width: 10},
                                    {header: "SEDE", key: "sede", width: 20},
                                    {header: "TIPO VEHICULO", key: "tipoVehiculo", width: 25},
                                    {header: "FACTOR EMISIÓN", key: "factoresEmisionString", width: 25},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 20},
                                ]}
                                title="REPORTE DE CALCULOS DE TRANSPORTE CASA TRABAJO"
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
                            <TableHead
                                className="text-xs whitespace-nowrap overflow-hidden text-ellipsis font-bold text-center">
                                TIPO DE VEHICULO
                            </TableHead>
                            <TableHead
                                className="text-xs whitespace-nowrap overflow-hidden text-ellipsis font-bold text-center">
                                CANTIDAD <span className="text-[10px]">[km]</span>
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
                        {transporteCasaTrabajoCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {transporteCasaTrabajoCalculos.data!.data.map(
                            (TransporteCasaTrabajoCalculate: TransporteCasaTrabajoCalcResponse) => (
                                <TableRow
                                    className="text-center"
                                    key={TransporteCasaTrabajoCalculate.id}
                                >
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {TransporteCasaTrabajoCalculate.sede}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {TransporteCasaTrabajoCalculate.tipoVehiculo}
                                    </TableCell>

                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {TransporteCasaTrabajoCalculate.cantidadTotal}
                                    </TableCell>
                                    <TableCell className="text-xs flex gap-2 justify-center sm:text-sm">
                                        {TransporteCasaTrabajoCalculate.factoresEmision.map((factorEmision: FactoresEmision) => (
                                            <Badge key={factorEmision.anio + factorEmision.factor} variant="secondary">
                                                {factorEmision.factor}<span
                                                className="text-[8px] ps-[2px] text-muted-foreground">{factorEmision.anio}</span>
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Badge variant="default">
                                            {TransporteCasaTrabajoCalculate.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {transporteCasaTrabajoCalculos.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={transporteCasaTrabajoCalculos.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>
        </div>
    );
}
