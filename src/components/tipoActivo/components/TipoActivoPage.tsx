"use client";
import React, {useCallback, useState} from "react";
import {Pen, Plus, Trash2, Bolt, Link2} from "lucide-react";
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
import {CreateFormTipoActivo} from "./CreateFormTipoActivo";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {UpdateFormTipoActivo} from "@/components/tipoActivo/components/UpdateFormTipoActivo";
import {deleteTipoActivo} from "@/components/tipoActivo/services/tipoActivo.actions";
import {
    TipoActivoCollection,
    TipoActivoCollectionItem,
} from "@/components/tipoActivo/services/tipoActivo.interface";
import {useTipoActivo} from "@/components/tipoActivo/lib/tipoActivo.hook";
import CustomPagination from "@/components/Pagination";
import Link from "next/link";
import {Input} from "@/components/ui/input";

export default function TipoActivoPage() {
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
        "CATEGORIA",
        "PESO [Kg]",
        "COSTO | UNITARIO",
        "LINK",
        "ACCIONES",
    ];

    //USE QUERIES
    const tipoActivoQuery = useTipoActivo(name, page);

    // HANDLES
    const handleNameChange = useCallback(
        (value: string) => {
            setName(value);
            setPage(1);
            tipoActivoQuery.refetch();
        },
        [tipoActivoQuery]
    );

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        tipoActivoQuery.refetch();
    }, [tipoActivoQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        tipoActivoQuery.refetch();
    }, [tipoActivoQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTipoActivo(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(
                error.response?.data?.message || "Error al eliminar el tipo de activo"
            );
        } finally {
            await tipoActivoQuery.refetch();
        }
    }, [tipoActivoQuery]);
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
        await tipoActivoQuery.refetch();
    };

    if (tipoActivoQuery.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">
                        Tipos de Activo
                    </h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Input
                            className="w-44 h-7 text-xs"
                            type="text"
                            placeholder="Buscar"
                            onChange={(e) => handleNameChange(e.target.value)}
                        />

                        <Link href="/tipo-activo/categoria">
                            <Button variant="secondary" size="sm" className="h-7 gap-1">
                                <Bolt className="h-3.5 w-3.5"/>
                                Categorías
                            </Button>
                        </Link>
                        <Link href="/tipo-activo/grupo">
                            <Button variant="secondary" size="sm" className="h-7 gap-1">
                                <Bolt className="h-3.5 w-3.5"/>
                                Grupos
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
                                    <DialogTitle> TIPOS DE ACTIVOS</DialogTitle>
                                    <DialogDescription>Agregar Tipo de Activo</DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <CreateFormTipoActivo onClose={handleClose}/>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {COLUMS.map((item) => (
                                <TableHead
                                    key={item}
                                    className="text-xs sm:text-sm font-bold text-center"
                                >
                                    {item.split("|").map((part, index) => (
                                        <span key={index}>
                                            {part} {index < item.split("|").length - 1 && <br/>}
                                        </span>
                                    ))}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tipoActivoQuery.data!.data.map(
                            (item: TipoActivoCollectionItem) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{item.rn}</Badge>
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.nombre}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.categoria}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.peso}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.costoUnitario}
                                    </TableCell>
                                    <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis p-1">
                                        <Link href={item.fuente} target="_blank" hidden={!item.fuente}>
                                            <Button
                                                className="h-7 w-7"
                                                size="icon"
                                                variant="outline"
                                            >
                                                <Link2 className="h-3.5 text-primary"/>
                                            </Button>
                                        </Link>
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
                {tipoActivoQuery.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={tipoActivoQuery.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Activo</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormTipoActivo onClose={handleCloseUpdate} id={idForUpdate}/>
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
