"use client";

import React, {useCallback, useEffect, useState} from "react";
import {Flame, Link2, Pen, Plus, Trash2} from "lucide-react";
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
import {errorToast, successToast} from "@/lib/utils/core.function";
import CustomPagination from "@/components/Pagination";
import {
    useTipoCombustible,
    useTipoCombustibleFactorPaginate
} from "@/components/tipoCombustible/lib/tipoCombustibleFactor.hook";
import {deleteTipoCombustibleFactor} from "@/components/tipoCombustible/services/tipoCombustibleFactor.actions";
import {TipoCombustibleFactorCollection} from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";
import SelectFilter from "@/components/SelectFilter";
import {FormTipoCombustibleFactor} from "@/components/tipoCombustible/components/FormTipoCombustibleFactor";
import {UpdateTipoCombustibleFactor} from "@/components/tipoCombustible/components/UpdateTipoCombustibleFactor";
import usePageTitle from "@/lib/stores/titleStore.store";
import {ChangeTitle} from "@/components/TitleUpdater";
import Link from "next/link";

export default function TipoCombustibleFactorPage() {
    ChangeTitle("Factor de Emisión de Combustible");
    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [selectTipoCombustible, setSelectTipoCombustible] = useState<string>("");

    //USE QUERIES
    const tipoCombustibleQuery = useTipoCombustibleFactorPaginate({
        tipoCombustibleId: selectTipoCombustible,
        page,
        perPage: 10,
    });

    const tiposCombustible = useTipoCombustible();

    // HANDLES
    const handleTipoCombustibleChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectTipoCombustible(value);
        await tipoCombustibleQuery.refetch();
    }, [tipoCombustibleQuery]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        tipoCombustibleQuery.refetch();
    }, [tipoCombustibleQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        tipoCombustibleQuery.refetch();
    }, [tipoCombustibleQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTipoCombustibleFactor(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data || error.response.data.message);
        } finally {
            await tipoCombustibleQuery.refetch();
        }
    }, [tipoCombustibleQuery]);

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
        await tipoCombustibleQuery.refetch();
    }

    if (tipoCombustibleQuery.isLoading || tiposCombustible.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div
                        className="flex gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
                        <SelectFilter
                            list={tiposCombustible.data!}
                            itemSelected={selectTipoCombustible}
                            handleItemSelect={handleTipoCombustibleChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Flame className="h-3 w-3"/>}
                        />
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle>Factor de Emisión de Combustible</DialogTitle>
                                    <DialogDescription>
                                        Agregar un nuevo factor de emisión de combustible
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <FormTipoCombustibleFactor onClose={handleClose}/>
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
                                TIPO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                NOMBRE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FE CO2 <span className="text-[10px]">[kgCO2/]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FE CH4 <span className="text-[10px]">[kgCO2eq/]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FE N2O <span className="text-[10px]">[kgCO2eq/]</span>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                AÑO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FUENTE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tipoCombustibleQuery.data!.data.map(
                            (item: TipoCombustibleFactorCollection, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{index + 1}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-center">
                                        <Badge className="text-xs text-start"
                                               variant="outline">{item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-start sm:text-sm">
                                        {item.tipoCombustible}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default"> {item.factorEmisionCO2.toFixed(7)} <span
                                            className="text-[9px] text-muted/80">{item.unidad}</span></Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary"> {item.factorEmisionCH4.toFixed(7)}<span
                                            className="text-[9px] text-muted-foreground">{item.unidad}</span></Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary"> {item.factorEmisionN2O.toFixed(7)}<span
                                            className="text-[9px] text-muted-foreground">{item.unidad}</span></Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="outline"> {item.anio}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.fuente}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm p-1">
                                        <div className="flex justify-center gap-4">
                                            {item.link && <Link href={item.link} target="_blank">
                                                <Button className="h-7 flex items-center gap-2" size="sm"
                                                        variant="secondary">
                                                    <Link2 className="h-3 w-3"/>
                                                </Button>
                                            </Link>}
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
                    tipoCombustibleQuery.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={tipoCombustibleQuery.data!.meta} onPageChange={handlePageChange}/>
                    )
                }
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Factor</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <UpdateTipoCombustibleFactor
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
