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

import SelectFilter from "@/components/selectFilter";
import ButtonCalculate from "@/components/buttonCalculate";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {consumoAguaCollection, consumoAguaCollectionItem} from "../services/consumoAgua.interface";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {
    useAnio,
    useArea,
    useConsumoAgua,
    useMes,
} from "../lib/consumoAgua.hooks";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    Building,
    Plus,
    Trash2,
    Calendar,
    CalendarDays,
    Pen,
    MapPinned,
} from "lucide-react";
import CustomPagination from "@/components/pagination";
import {useSede} from "@/components/consumoElectricidad/lib/electricidad.hooks";
import {deleteConsumoAgua} from "../services/consumoAgua.actions";
import {FormConsumoAgua} from "./FormConsumoAgua";
import {UpdateFormConsumoAgua} from "./UpdateFormElectricidad";

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

    //HOOKS
    const consumoAgua = useConsumoAgua({
        // sedeId: selectedSede ? Number(selectedSede) : undefined,
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
    }, [areas, consumoAgua]);

    useEffect(() => {
        consumoAgua.refetch();
    }, [selectedArea]);

    const handleAnioChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedAnio(value);
        await consumoAgua.refetch();
    }, [consumoAgua]);

    const handleAreaChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedArea(value);
        await consumoAgua.refetch();
    }, [consumoAgua]);

    const handleMesChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedMes(value);
        await consumoAgua.refetch();
    }, [consumoAgua]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        consumoAgua.refetch();
    }, [consumoAgua]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        consumoAgua.refetch();
    }, [consumoAgua]);

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
    }, [idForDelete, consumoAgua]);

    if (consumoAgua.isLoading || areas.isLoading || sedes.isLoading || anios.isLoading || meses.isLoading) {
        return <SkeletonTable/>;
    }

    if (consumoAgua.isError || areas.isError || sedes.isError || anios.isError || meses.isError) {
        errorToast("Error al cargar los datos");
        return <SkeletonTable/>;
    }

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await consumoAgua.refetch();
    }

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-gray-800 font-bold">CONSUMO DE AGUA </h1>
                    <h2 className="text-xs sm:text-sm text-gray-500">
                        Huella de carbono
                    </h2>
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
                        <ButtonCalculate onClick={handleCalculate}/>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md border-2">
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
                                    <Badge variant="secondary">{index + 1}</Badge>
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
                        <DialogTitle>Actualizar Registro de Fertilizante</DialogTitle>
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
