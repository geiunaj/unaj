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
import SkeletonTable from "@/components/Layout/skeletonTable";
import {ReportRequest} from "@/lib/interfaces/globals";
import {Button} from "@/components/ui/button";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {
    useConsumoPapelCalculos,
    useConsumoPapelCalculosReport, useSedes
} from "@/components/consumoPapel/lib/consumoPapelCalculos.hooks";
import {ConsumoPapelCalculoResponse} from "@/components/consumoPapel/services/consumoPapelCalculate.interface";
import {createConsumoPapelCalculate} from "@/components/consumoPapel/services/consumoPapelCalculate.actions";

export default function ConsumoPapelCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [page, setPage] = useState(1);


    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const consumoPapelCalculos = useConsumoPapelCalculos({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
        page,
    });
    const consumoPapelCalculosReport = useConsumoPapelCalculosReport({
        sedeId: parseInt(selectedSede),
        from: from,
        to: to,
    });

    const sedes = useSedes();

    const handleConsumoPapel = () => {
        push("/papel");
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await consumoPapelCalculos.refetch();
        await consumoPapelCalculosReport.refetch();
    }, [consumoPapelCalculos, consumoPapelCalculosReport]);

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await consumoPapelCalculos.refetch();
        await consumoPapelCalculosReport.refetch();
    }, [consumoPapelCalculos, consumoPapelCalculosReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await consumoPapelCalculos.refetch();
        await consumoPapelCalculosReport.refetch();
    }, [consumoPapelCalculos, consumoPapelCalculosReport]);

    const handleCalculate = useCallback(async () => {
        await createConsumoPapelCalculate({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            from,
            to,
        }).then(() => {
            successToast("Calculo realizado con éxito");
        })
            .catch((error: any) => {
                errorToast(error.response.data.message);
            });
        await consumoPapelCalculos.refetch();
        await consumoPapelCalculosReport.refetch();
    }, [selectedSede, from, to, consumoPapelCalculos, consumoPapelCalculosReport]);


    const handleClickExcelReport = useCallback(async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "rn", width: 10},
            {header: "TIPO PAPEL", key: "tipoPapel", width: 30},
            {header: "CANTIDAD", key: "cantidad", width: 25},
            {header: "CONSUMO", key: "consumo", width: 15},
            {header: "RECICLADO[%]", key: "porcentajeReciclado", width: 20},
            {header: "VIRGEN[%]", key: "porcentajeVirgen", width: 25},
            {header: "SEDE", key: "sede", width: 25},
            {header: "TOTAL GEI", key: "totalGEI", width: 10},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await consumoPapelCalculosReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), "REPORTE DE EMISIONES DE PAPEL", "consumo-papel");
    }, [consumoPapelCalculosReport]);

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (consumoPapelCalculos.isLoading || consumoPapelCalculosReport.isLoading || sedes.isLoading) {
        return <SkeletonTable/>;
    }

    if (consumoPapelCalculos.isError || consumoPapelCalculosReport.isError || sedes.isError) {
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
                            <ButtonBack onClick={handleConsumoPapel}/>
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
                                handleFromChange={handleFromChange}
                                handleToChange={handleToChange}
                                withMonth={true}
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
                                data={consumoPapelCalculosReport.data!.data}
                                fileName={`REPORTE DE EMISIONES DE PAPEL_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 10},
                                    {header: "TIPO PAPEL", key: "tipoPapel", width: 15},
                                    {header: "CANTIDAD", key: "cantidad", width: 10},
                                    {header: "CONSUMO", key: "consumo", width: 15},
                                    {header: "RECICLADO[%]", key: "porcentajeReciclado", width: 10},
                                    {header: "VIRGEN[%]", key: "porcentajeVirgen", width: 10},
                                    {header: "SEDE", key: "sede", width: 15},
                                    {header: "TOTAL GEI", key: "totalGEI", width: 15},
                                ]}
                                title="REPORTE DE EMISIONES DE PAPEL"
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
                                TIPO PAPEL
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                GRAMAJE <span className="text-[10px]">[g/m2]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CANTIDAD
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO <span className="text-[10px]">[kg]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                RECICLADO <span className="text-[10px]">[%]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                VIRGEN <span className="text-[10px]">[%]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                EMISIONES GEI <span className="text-[10px]">[tCO2eq]</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consumoPapelCalculos.data!.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Click en el botón <strong className="text-primary">Calcular</strong> para obtener
                                    los resultados
                                </TableCell>
                            </TableRow>
                        )}
                        {consumoPapelCalculos.data!.data.map(
                            (FertilizanteCalculate: ConsumoPapelCalculoResponse) => (
                                <TableRow
                                    className="text-center"
                                    key={FertilizanteCalculate.id}
                                >
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.tipoPapel}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.gramaje}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.cantidad}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">
                                            {FertilizanteCalculate.consumo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.porcentajeReciclado}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {FertilizanteCalculate.porcentajeVirgen}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {FertilizanteCalculate.totalGEI}
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
