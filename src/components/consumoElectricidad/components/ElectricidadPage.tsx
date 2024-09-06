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
import {useCallback, useEffect, useRef, useState} from "react";

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
import {electricidadCollectionItem} from "../services/electricidad.interface";
import {FormElectricidad} from "./FormElectricidad";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {
    useArea,
    useElectricidad,
    useElectricidadReport,
    useMes,
    useSede,
} from "../lib/electricidad.hooks";
import {deleteElectricidad} from "../services/electricidad.actions";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    Building,
    Plus,
    Trash2,
    CalendarDays,
    Pen,
    MapPinned,
    FileSpreadsheet,
} from "lucide-react";
import CustomPagination from "@/components/Pagination";
import {UpdateFormElectricidad} from "@/components/consumoElectricidad/components/UpdateFormElectricidad";
import GenerateReport from "@/lib/utils/generateReport";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {ReportRequest} from "@/lib/interfaces/globals";

export default function ElectricidadPage() {
    //NAVIGATION
    const {push} = useRouter();
    const [page, setPage] = useState<number>(1);

    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    //SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedArea, setSelectedArea] = useState<string>("1");
    const [selectedMes, setSelectedMes] = useState<string>("");
    // const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
    //     "desc"
    // );

    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    //HOOKS
    const electricidad = useElectricidad({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        areaId: selectedArea ? Number(selectedArea) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        from,
        to,
        page: page,
    });

    const electricidadReport = useElectricidadReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        areaId: selectedArea ? Number(selectedArea) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        from,
        to,
    });

    const sedes = useSede();
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

    const handleSedeChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedSede(value);
            const refetchData = await areas.refetch();
            setSelectedArea(refetchData.data![0].id.toString());
        },
        [areas, electricidad]
    );

    useEffect(() => {
        electricidad.refetch();
        electricidadReport.refetch();
    }, [selectedArea]);

    const handleAreaChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedArea(value);
            await electricidad.refetch();
            await electricidadReport.refetch();
        },
        [electricidad, electricidadReport]
    );

    const handleMesChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedMes(value);
            await electricidad.refetch();
            await electricidadReport.refetch();
        },
        [electricidad, electricidadReport]
    );

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await electricidad.refetch();
            await electricidadReport.refetch();
        },
        [electricidad, electricidadReport]
    );

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setTo(value);
            await electricidad.refetch();
            await electricidadReport.refetch();
        },
        [electricidad, electricidadReport]
    );

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        electricidad.refetch();
        electricidadReport.refetch();
    }, [electricidad, electricidadReport]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        electricidad.refetch();
        electricidadReport.refetch();
    }, [electricidad, electricidadReport]);

    const handleCalculate = () => {
        push("/electricidad/calculos");
    };

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteElectricidad(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
        await electricidad.refetch();
        await electricidadReport.refetch();
    }, [idForDelete, electricidad, electricidadReport]);

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await electricidad.refetch();
        await electricidadReport.refetch();
    };

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "N° DE SUMINISTRO", key: "numeroSuministro", width: 15},
            {header: "CONSUMO", key: "consumo", width: 20},
            {header: "AREA", key: "area", width: 15},
            {header: "SEDE", key: "sede", width: 20},
            {header: "AÑO", key: "anio", width: 15},
            {header: "MES", key: "mes", width: 30},
        ];
        console.log(period);
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await electricidadReport.refetch();
        await GenerateReport(
            data.data!.data,
            columns,
            formatPeriod(period, true),
            `REPORTE DE CONSUMO DE ENERGÍA ELÉCTRICA`,
            "consumo-electricidad"
        );
    };

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (electricidad.isLoading || areas.isLoading || sedes.isLoading || meses.isLoading || electricidadReport.isLoading) {
        return <SkeletonTable/>;
    }

    if (electricidad.isError || areas.isError || sedes.isError || meses.isError || electricidadReport.isError) {
        errorToast("Error al cargar los datos");
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">
                        Consumo de Electricidad
                    </h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">
                        Huella de carbono{" "}
                    </h2>
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
                                data={electricidadReport.data!.data}
                                fileName={`REPORTE DE CONSUMO DE ELECTRICIDAD_${formatPeriod(
                                    {from, to},
                                    true
                                )}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 5},
                                    {header: "NUMERO DE SUMINISTRO", key: "numeroSuministro", width: 20},
                                    {header: "CONSUMO", key: "consumo", width: 15},
                                    {header: "MES", key: "mes", width: 15},
                                    {header: "AÑO", key: "anio", width: 15},
                                    {header: "AREA", key: "area", width: 15},
                                    {header: "SEDE", key: "sede", width: 15},
                                ]}
                                title="REPORTE DE CONSUMO DE ELECTRICIDAD"
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
                                <DialogContent className="max-w-lg border-2">
                                    <DialogHeader className="">
                                        <DialogTitle>CONSUMO DE ELECTRICIDAD</DialogTitle>
                                        <DialogDescription>
                                            Indicar el consumo de electricidad
                                        </DialogDescription>
                                        <DialogClose></DialogClose>
                                    </DialogHeader>
                                    <FormElectricidad onClose={handleClose}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap flex flex-col gap-10    ">
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
                                N° SUMINISTRO
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
                        {electricidad.data!.data.map(
                            (item: electricidadCollectionItem, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{index + 1}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.area}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.numeroSuministro}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">{item.consumo}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.mes}
                                    </TableCell>
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
                                                <Pen className="h-3.5 text-blue-700"/>
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
                            )
                        )}
                    </TableBody>
                </Table>
                {electricidad.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={electricidad.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="max-w-lg border-2">
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de cosumo de Electricidad</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormElectricidad
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
