"use client";

import React, {useCallback, useState} from "react";
import SelectFilter from "@/components/SelectFilter";
import {Pen, Plus, Trash2, Calendar, Link2, Bean, Car, Scroll} from "lucide-react";
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
import {
    useAnio, useTipoPapel, usePapelFactor,
} from "../lib/tipoPapelFactor.hook";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {PapelFactorCollection} from "../services/tipoPapelFactor.interface";
import Link from "next/link";
import CustomPagination from "@/components/Pagination";
import {CreateFormTipoPapelFactor} from "@/components/tipoPapel/components/CreateFormTipoPapelFactor";
import {
    UpdateFormTipoPapelFactor
} from "@/components/tipoPapel/components/UpdateFormTipoPapelFactor";
import {ChangeTitle} from "@/components/TitleUpdater";
import {deleteTipoPapelFactor} from "@/components/tipoPapel/services/tipoPapelFactor.actions";

export default function PapelFactorPage() {
    ChangeTitle("Factor de Emisión de Papel");

    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectAnio, setSelectAnio] = useState<string>(new Date().getFullYear().toString());
    const [selectTipoPapel, setSelectTipoPapel] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const anioQuery = useAnio();
    const tipoPapelQuery = useTipoPapel();

    //IDS
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);


    const factorEmisionQuery = usePapelFactor({
        tipoPapelId: selectTipoPapel,
        anioId: selectAnio,
        page,
        perPage: 10
    });


    const handleAnioChange = useCallback(async (value: string) => {
        await setSelectAnio(value);
        await factorEmisionQuery.refetch();
    }, [factorEmisionQuery]);

    const handleTipoPapelChange = useCallback(async (value: string) => {
        await setSelectTipoPapel(value);
        await factorEmisionQuery.refetch();
    }, [factorEmisionQuery]);

    // HANDLES
    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        factorEmisionQuery.refetch();
    }, [factorEmisionQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        factorEmisionQuery.refetch();
    }, [factorEmisionQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTipoPapelFactor(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response?.data?.message);
        } finally {
            await factorEmisionQuery.refetch();
        }
    }, [factorEmisionQuery]);
    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handlePageChange = async (page: number) => {
        await setPage(page);
        await factorEmisionQuery.refetch();
    }

    if (anioQuery.isLoading || factorEmisionQuery.isLoading || tipoPapelQuery.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
                        <SelectFilter
                            list={tipoPapelQuery.data!}
                            itemSelected={selectTipoPapel}
                            handleItemSelect={handleTipoPapelChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Scroll className="h-3 w-3"/>}
                        />
                        <SelectFilter
                            list={anioQuery.data!}
                            itemSelected={selectAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"nombre"}
                            all={true}
                            icon={<Calendar className="h-3 w-3"/>}
                        />
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle> Factor de Tipo de Papel</DialogTitle>
                                    <DialogDescription>
                                        Agregar Factor de Tipo de Papel
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <CreateFormTipoPapelFactor onClose={handleClose}/>
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
                                TIPO DE PAPEL
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FACTOR
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
                        {factorEmisionQuery.data!.data.map(
                            (item: PapelFactorCollection, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{index + 1}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.tipoPapel}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default" className="space-x-2">
                                            {item.factor}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.anio}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm p-1">
                                        <div className="flex items-center justify-center gap-4">
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
                {
                    factorEmisionQuery.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={factorEmisionQuery.data!.meta} onPageChange={handlePageChange}/>
                    )
                }
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Papel</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormTipoPapelFactor onClose={handleCloseUpdate} id={idForUpdate}/>
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
