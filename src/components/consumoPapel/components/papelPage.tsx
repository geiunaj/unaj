"use client";

import {useCallback, useState} from "react";
import SelectFilter from "@/components/selectFilter";
import {Building, Calendar, File, Pen, Plus, Trash2} from "lucide-react";
import ButtonCalculate from "@/components/buttonCalculate";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button, buttonVariants} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {getSedes} from "@/components/sede/services/sede.actions";
import {Badge} from "@/components/ui/badge";
import {CollectionConsumoPapel} from "@/components/consumoPapel/services/consumoPapel.interface";
import {FormPapel} from "@/components/consumoPapel/components/FormPapelOficce";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {UpdateFormPapel} from "@/components/consumoPapel/components/UpdateFormPapelOficce";
import {useAnios, useConsumosPapel, useSedes, useTipoPapel} from "@/components/consumoPapel/lib/consumoPapel.store";
import { deleteConsumoPapel } from "../services/consumoPapel.actions";
import { errorToast, successToast } from "@/lib/utils/core.function";

export default function PapelPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedTipoPapel, setSelectedTipoPapel] = useState<string>("");
    const [selectedAnio, setSelectedAnio] = useState<string>(new Date().getFullYear().toString());

    const sedeQuery = useSedes();
    const consumoPapelQuery = useConsumosPapel(selectedSede, selectedTipoPapel, selectedAnio);
    const tiposPapelQuery = useTipoPapel();
    const aniosQuery = useAnios();

    // HANDLES
    const handleSedeChange = useCallback(async (value: string) => {
        await setSelectedSede(value);
        await consumoPapelQuery.refetch();
    }, [consumoPapelQuery]);

    const handleTipoPapelChange = useCallback(async (value: string) => {
        await setSelectedTipoPapel(value);
        await consumoPapelQuery.refetch();
    }, [consumoPapelQuery]);

    const handleAnioChange = useCallback(async (value: string) => {
        await setSelectedAnio(value);
        await consumoPapelQuery.refetch();
    }, [consumoPapelQuery]);

    const handleCalculate = useCallback(() => {
        consumoPapelQuery.refetch(); // redirigir a la misma página
    }, [consumoPapelQuery]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        consumoPapelQuery.refetch();
    }, [consumoPapelQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        consumoPapelQuery.refetch();
    }, [consumoPapelQuery]);


    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteConsumoPapel(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(
                error.response?.data?.message || "Error al eliminar el consumo de papel"
            );
        } finally {
            await consumoPapelQuery.refetch();
        }
    }, [consumoPapelQuery]);

    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    if (sedeQuery.isLoading || consumoPapelQuery.isLoading || tiposPapelQuery.isLoading) {
        return <SkeletonTable/>
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-gray-800 font-bold">Consumo de Papel</h1>
                    <h2 className="text-xs sm:text-sm text-gray-500">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">

                        <SelectFilter
                            list={tiposPapelQuery.data!}
                            itemSelected={selectedTipoPapel}
                            handleItemSelect={handleTipoPapelChange}
                            value={"id"}
                            nombre={"nombreFiltro"}
                            id={"id"}
                            all={true}
                            icon={<File className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={sedeQuery.data!}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            icon={<Building className="h-3 w-3"/>}
                            all={true}
                        />

                        <SelectFilter
                            list={aniosQuery.data!}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Calendar className="h-3 w-3"/>}
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
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle> CONSUMO PAPEL</DialogTitle>
                                    <DialogDescription>
                                        Registrar el consumo de papel
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <FormPapel onClose={handleClose}/>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                N°
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                NOMBRE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                UNIDAD
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CANTIDAD
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                GRAMAJE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CERTIFICADO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                % RECICLADO
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
                        {consumoPapelQuery.data!.map((item: CollectionConsumoPapel, index: number) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="secondary">{index + 1}</Badge>
                                </TableCell>
                                <TableCell
                                    className="text-xs sm:text-sm">{item.nombre}</TableCell>
                                <TableCell
                                    className="text-xs sm:text-sm">{item.unidad_paquete}</TableCell>
                                <TableCell
                                    className="text-xs sm:text-sm">
                                    <Badge variant="default">{item.cantidad_paquete}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.gramaje}</TableCell>
                                <TableCell
                                    className="text-xs sm:text-sm">{item.nombre_certificado}</TableCell>
                                <TableCell
                                    className="text-xs sm:text-sm">
                                    {item.porcentaje_reciclado !== 0 ? item.porcentaje_reciclado : ""}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.anio}</TableCell>
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
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Fertilizante</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormPapel onClose={handleCloseUpdate} id={idForUpdate}/>
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
