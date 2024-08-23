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
import {useCallback, useEffect, useState} from "react";

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
import {electricidadCollection, electricidadCollectionItem} from "../services/electricidad.interface";
import {FormElectricidad} from "./FormElectricidad";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {
    useAnio,
    useArea,
    useElectricidad, useElectricidadReport,
    useMes,
    useSede,
} from "../lib/electricidad.hooks";
import {deleteElectricidad} from "../services/electricidad.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
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
import {UpdateFormElectricidad} from "@/components/consumoElectricidad/components/UpdateFormElectricidad";
import {useCombustibleReport} from "@/components/combustion/lib/combustion.hook";
import ReportPopover, {formatPeriod, ReportRequest} from "@/components/ReportPopover";
import GenerateReport from "@/lib/utils/generateReport";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

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
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedArea, setSelectedArea] = useState<string>("1");
    const [selectedMes, setSelectedMes] = useState<string>("");
    const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
        "desc"
    );

    //HOOKS
    const electricidad = useElectricidad({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        anioId: selectedAnio ? Number(selectedAnio) : undefined,
        areaId: selectedArea ? Number(selectedArea) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
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
    }, [areas, electricidad]);

    useEffect(() => {
        electricidad.refetch();
    }, [selectedArea]);

    const handleAnioChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedAnio(value);
        await electricidad.refetch();
    }, [electricidad]);

    const handleAreaChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedArea(value);
        await electricidad.refetch();
    }, [electricidad]);

    const handleMesChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedMes(value);
        await electricidad.refetch();
    }, [electricidad]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        electricidad.refetch();
    }, [electricidad]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        electricidad.refetch();
    }, [electricidad]);

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
    }, [idForDelete, electricidad]);


    const handlePageChage = async (page: number) => {
        await setPage(page);
        await electricidad.refetch();
    }

    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    const electricidadReport = useElectricidadReport({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        anioId: selectedAnio ? Number(selectedAnio) : undefined,
        areaId: selectedArea ? Number(selectedArea) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        page: page,
        from,
        to
    });

    const handleClickReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10,},
            {header: "N° DE SUMINISTRO", key: "numeroSuministro", width: 15,},
            {header: "CONSUMO", key: "consumo", width: 20,},
            {header: "AREA", key: "area", width: 15,},
            {header: "SEDE", key: "sede", width: 20,},
            {header: "AÑO", key: "anio", width: 15,},
            {header: "MES", key: "mes", width: 30,},
        ];
        console.log(period);
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await electricidadReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period), `REPORTE DE CONSUMO DE ENERGÍA ELÉCTRICA`);
    }

    if (electricidad.isLoading || areas.isLoading || sedes.isLoading || anios.isLoading || meses.isLoading) {
        return <SkeletonTable/>;
    }

    if (electricidad.isError || areas.isError || sedes.isError || anios.isError || meses.isError) {
        errorToast("Error al cargar los datos");
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Consumo de Electricidad</h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground"> Huella de carbono </h2>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
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
                            list={anios.data!}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Calendar className="h-3 w-3"/>}
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
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    size="sm"
                                    className="h-7 gap-1"
                                    variant="outline"
                                >
                                    <FileSpreadsheet className="h-3.5 w-3.5"/>
                                    Reporte
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <ReportPopover
                                    onClick={(data: ReportRequest) => handleClickReport(data)}
                                    withMonth={true}
                                />
                            </PopoverContent>
                        </Popover>

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
                                    <DialogTitle>Consumo de electricidad</DialogTitle>
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
                        {electricidad.data!.data.map((item: electricidadCollectionItem, index: number) => (
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
                        ))}
                    </TableBody>
                </Table>
                {
                    electricidad.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={electricidad.data!.meta} onPageChange={handlePageChage}/>
                    )
                }
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="max-w-lg border-2">
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Fertilizante</DialogTitle>
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
