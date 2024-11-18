"use client";

import React, {useCallback, useState} from "react";
import SelectFilter from "@/components/SelectFilter";
import {Pen, Plus, Trash2, Bean, Bolt} from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import {Badge} from "@/components/ui/badge";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {CreateFormTipoConsumible} from "./CreateFormTipoConsumible";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {UpdateFormTipoConsumible} from "@/components/tipoConsumible/components/UpdateFormTipoConsumible";
import {deleteTipoConsumible} from "@/components/tipoConsumible/services/tipoConsumible.actions";
import {
    TipoConsumibleCollection,
    TipoConsumibleCollectionItem
} from "@/components/tipoConsumible/services/tipoConsumible.interface";
import {useTipoConsumible} from "@/components/tipoConsumible/lib/tipoConsumible.hook";
import CustomPagination from "@/components/Pagination";
import Link from "next/link";
import {Input} from "@/components/ui/input";

export default function TipoConsumiblePage() {
    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    //IDS
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    const [name, setName] = useState("");
    const [page, setPage] = useState(1);

    const COLUMS = [
        "N°",
        "NOMBRE",
        "UNIDAD",
        "DESCRIPCION",
        "CATEGORIA",
        "GRUPO",
        "PROCESO",
        "ACCIONES",
    ];

    //USE QUERIES
    const tipoConsumibleQuery = useTipoConsumible(name, page);

    // HANDLES
    const handleNameChange = useCallback((value: string) => {
        setName(value);
        setPage(1);
        tipoConsumibleQuery.refetch()
    }, [tipoConsumibleQuery]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        tipoConsumibleQuery.refetch();
    }, [tipoConsumibleQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        tipoConsumibleQuery.refetch();
    }, [tipoConsumibleQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTipoConsumible(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(
                error.response?.data?.message || "Error al eliminar el tipo de consumible"
            );
        } finally {
            await tipoConsumibleQuery.refetch();
        }
    }, [tipoConsumibleQuery]);
    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await tipoConsumibleQuery.refetch();
    };

    if (tipoConsumibleQuery.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Tipos de Consumible</h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">Huella de carbono</h2>
                </div>
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Input className="w-44 h-7 text-xs" type="text" placeholder="Buscar"
                               onChange={(e) => handleNameChange(e.target.value)}/>

                        <Link href="/tipo-consumible/descripcion">
                            <Button variant="secondary" size="sm" className="h-7 gap-1">
                                <Bolt className="h-3.5 w-3.5"/>
                                Descripciones
                            </Button>
                        </Link>
                        <Link href="/tipo-consumible/categoria">
                            <Button variant="secondary" size="sm" className="h-7 gap-1">
                                <Bolt className="h-3.5 w-3.5"/>
                                Categorías
                            </Button>
                        </Link>
                        <Link href="/tipo-consumible/grupo">
                            <Button variant="secondary" size="sm" className="h-7 gap-1">
                                <Bolt className="h-3.5 w-3.5"/>
                                Grupos
                            </Button>
                        </Link>
                        <Link href="/tipo-consumible/proceso">
                            <Button variant="secondary" size="sm" className="h-7 gap-1">
                                <Bolt className="h-3.5 w-3.5"/>
                                Procesos
                            </Button>
                        </Link>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle> TIPOS DE CONSUMIBLE</DialogTitle>
                                    <DialogDescription>
                                        Agregar Tipo de Consumible
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <CreateFormTipoConsumible onClose={handleClose}/>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {
                                COLUMS.map((item) => (
                                    <TableHead key={item} className="text-xs sm:text-sm font-bold text-center">
                                        {item}
                                    </TableHead>
                                ))
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tipoConsumibleQuery.data!.data.map(
                            (item: TipoConsumibleCollectionItem) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{item.rn}</Badge>
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.nombre}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.unidad}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.descripcion}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.categoria}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-24  whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.grupo}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-48 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.proceso}
                                    </TableCell>

                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis p-1">
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
                            )
                        )}
                    </TableBody>
                </Table>
                {tipoConsumibleQuery.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={tipoConsumibleQuery.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Consumible</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormTipoConsumible onClose={handleCloseUpdate} id={idForUpdate}/>
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
