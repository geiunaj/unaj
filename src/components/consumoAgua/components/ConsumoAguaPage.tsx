"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, {useCallback, useEffect, useRef, useState} from "react";

import SelectFilter from "@/components/SelectFilter";
import ButtonCalculate from "@/components/ButtonCalculate";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {consumoAguaCollectionItem} from "../services/consumoAgua.interface";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {
    useAnio,
    useArea,
    useConsumoAgua, useConsumoAguaReport,
    useMes, useSede,
} from "../lib/consumoAgua.hooks";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    Building,
    Plus,
    Trash2,
    Calendar,
    CalendarDays,
    Pen,
    MapPinned, FileSpreadsheet,
} from "lucide-react";
import CustomPagination from "@/components/Pagination";
import {deleteConsumoAgua} from "../services/consumoAgua.actions";
import {FormConsumoAgua} from "./FormConsumoAgua";
import {UpdateFormConsumoAgua} from "./UpdateFormConsumoAgua";
import GenerateReport from "@/lib/utils/generateReport";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {ReportRequest} from "@/lib/interfaces/globals";

export default function ConsumoAguaPage() {
    //NAVIGATION
    const {push} = useRouter();
    const [page, setPage] = useState<number>(1);

    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    //SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedArea, setSelectedArea] = useState<string>("1");
    const [selectedMes, setSelectedMes] = useState<string>("");
    const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
        "desc"
    );
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    //HOOKS
    const consumoAgua = useConsumoAgua({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        areaId: selectedArea ? Number(selectedArea) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        from,
        to,
        page: page,
    });

    const consumoAguaReport = useConsumoAguaReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        areaId: selectedArea ? Number(selectedArea) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        from,
        to,
        page: page,
    });

    const sedes = useSede();
    const anios = useAnio();
    const meses = useMes();
    const areas = useArea(Number(selectedSede));

    // IDS
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        const refetchData = await areas.refetch();
        setSelectedArea(refetchData.data![0].id.toString());
    }, [areas, consumoAgua]);

    useEffect(() => {
        consumoAgua.refetch();
        consumoAguaReport.refetch();
    }, [selectedArea]);

    const handleAreaChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedArea(value);
        await consumoAgua.refetch();
        await consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport]);

    const handleMesChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedMes(value);
        await consumoAgua.refetch();
        await consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport]);

    const handleFromChange = useCallback(async (value: string) => {
        await setPage(1);
        await setFrom(value);
        await consumoAgua.refetch();
        await consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport]);

    const handleToChange = useCallback(async (value: string) => {
        await setPage(1);
        await setTo(value);
        await consumoAgua.refetch();
        await consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        consumoAgua.refetch();
        consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        consumoAgua.refetch();
        consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport]);

    const handleCalculate = () => {
        push("/consumoAgua/calculos");
    };

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteConsumoAgua(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
        await consumoAgua.refetch();
        await consumoAguaReport.refetch();
    }, [consumoAgua, consumoAguaReport, idForDelete]);

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await consumoAgua.refetch();
        await consumoAguaReport.refetch();
    }

    const handleClickReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10,},
            {header: "CÓDIGO MEDIDOR", key: "codigoMedidor", width: 20,},
            {header: "CONSUMO", key: "consumo", width: 15,},
            {header: "FUENTE DE AGUA", key: "fuenteAgua", width: 20,},
            {header: "MES", key: "mes", width: 20,},
            {header: "AÑO", key: "anio", width: 10,},
            {header: "AREA", key: "area", width: 20,},
            {header: "SEDE", key: "sede", width: 15,},
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await consumoAguaReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), `REPORTE DE CONSUMO DE AGUA`, `Consumo Agua`);
    }

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (consumoAgua.isLoading || areas.isLoading || sedes.isLoading || anios.isLoading || meses.isLoading || consumoAguaReport.isLoading) {
        return <SkeletonTable/>;
    }

    if (consumoAgua.isError || areas.isError || sedes.isError || anios.isError || meses.isError || consumoAguaReport.isError) {
        errorToast("Error al cargar los datos");
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Consumo de Agua</h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">Huella de carbono</h2>
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
                                icon={<Building className="h-3 w-3"/>}
                            />

                            <SelectFilter
                                list={areas.data!}
                                itemSelected={selectedArea}
                                handleItemSelect={handleAreaChange}
                                value={"id"}
                                nombre={"nombre"}
                                id={"id"}
                                all={true}
                                icon={<MapPinned className="h-3 w-3"/>}
                            />

                            <SelectFilter
                                list={meses.data!}
                                itemSelected={selectedMes}
                                handleItemSelect={handleMesChange}
                                value={"id"}
                                nombre={"nombre"}
                                id={"id"}
                                all={true}
                                icon={<CalendarDays className="h-3 w-3"/>}
                            />

                            <ReportComponent
                                onSubmit={handleClickReport}
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
                                data={consumoAguaReport.data!.data}
                                fileName={`REPORTE DE CONSUMO DE AGUA_${formatPeriod({from, to}, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 5},
                                    {header: "CÓDIGO MEDIDOR", key: "codigoMedidor", width: 15},
                                    {header: "CONSUMO", key: "consumo", width: 15},
                                    {header: "FUENTE DE AGUA", key: "fuenteAgua", width: 15},
                                    {header: "MES", key: "mes", width: 10},
                                    {header: "AÑO", key: "anio", width: 10},
                                    {header: "AREA", key: "area", width: 15},
                                    {header: "SEDE", key: "sede", width: 15},
                                ]}
                                title="REPORTE DE CONSUMO DE AGUA"
                                period={formatPeriod({from, to}, true)}
                            />

                            <ButtonCalculate onClick={handleCalculate}/>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="h-7 gap-1">
                                        <Plus className="h-3.5 w-3.5"/>
                                        Registrar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl border-2">
                                    <DialogHeader className="">
                                        <DialogTitle>CONSUMO DE AGUA</DialogTitle>
                                        <DialogDescription>
                                            Indicar el Consumo de Agua
                                        </DialogDescription>
                                        <DialogClose></DialogClose>
                                    </DialogHeader>
                                    <FormConsumoAgua onClose={handleClose}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap flex flex-col gap-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                N°
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                AREA
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CODIGO DE MEDIDOR
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FUENTE DE AGUA
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                MES
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                AÑO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {consumoAgua.data!.data.map((item: consumoAguaCollectionItem, index: number) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="secondary">{10 * (page - 1) + index + 1}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.area}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.codigoMedidor}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.fuenteAgua}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="default">{item.consumo}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.mes}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.anio}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm p-1">
                                    <div className="flex justify-center gap-4">
                                        {/*UPDATE*/}
                                        <Button
                                            className="h-7 w-7"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleClickUpdate(item.id)}
                                        >
                                            <Pen className="h-3.5 text-primary"/>
                                        </Button>

                                        {/*DELETE*/}
                                        <Button
                                            className="h-7 w-7"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleCLickDelete(item.id)}
                                        >
                                            <Trash2 className="h-3.5 text-gray-500"/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                    consumoAgua.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={consumoAgua.data!.meta} onPageChange={handlePageChage}/>
                    )
                }
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Consumo de Agua</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormConsumoAgua
                        onClose={handleCloseUpdate}
                        id={idForUpdate}
                    />
                </DialogContent>
            </Dialog>

            {/*    MODAL DELETE*/}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar registro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer, ¿Estás seguro de eliminar este
                            registro?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({variant: "destructive"})}
                            onClick={handleDelete}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
