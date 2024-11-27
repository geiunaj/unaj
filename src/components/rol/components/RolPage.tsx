"use client";
import {useCallback, useState} from "react";
import {Pen, Plus, Trash2, Building} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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
import {useRol} from "../lib/rol.hook";
import {useSede} from "@/components/combustion/lib/combustion.hook";
import {ChangeTitle} from "@/components/TitleUpdater";
import {CreateRol} from "@/components/rol/components/CreateRol";
import {RolCollectionItem} from "@/components/rol/services/rol.interface";
import {UpdateRol} from "@/components/rol/components/UpdateRol";

export default function RolPage() {
    ChangeTitle("Roles");

    const [page, setPage] = useState(1);

    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    const [selectedSede, setSelectedSede] = useState<string>("1");

    // USE QUERY
    const rol = useRol();

    const sedes = useSede();

    // HANDLES
    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        rol.refetch();
    }, [rol]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        rol.refetch();
    }, [rol]);

    // const handleDelete = useCallback(async () => {
    //     try {
    //         const response = await deleteUsuario(idForDelete);
    //         setIsDeleteDialogOpen(false);
    //         successToast(response.data.message);
    //     } catch (error: any) {
    //         errorToast(error.response.data || error.response.data.message);
    //     } finally {
    //         await rol.refetch();
    //     }
    // }, [rol]);

    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await rol.refetch();
    }, [rol]);

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    if (rol.isLoading || sedes.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <SheetTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Agregar
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-auto">
                                <SheetHeader>
                                    <SheetTitle>Agregar Rol</SheetTitle>
                                    <SheetDescription className="text-xs">
                                        Llene los campos para agregar un nuevo rol
                                    </SheetDescription>
                                </SheetHeader>
                                <CreateRol onClose={handleClose}/>
                            </SheetContent>
                        </Sheet>
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
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rol.data!.data.map((item: RolCollectionItem, index: number) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="secondary">{index + 1}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.type_name}
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
            </div>

            {/*MODAL UPDATE*/}
            <Sheet open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <SheetContent className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Actualizar Rol</SheetTitle>
                        <SheetDescription className="text-xs">
                            Llene los campos para actualizar el rol
                        </SheetDescription>
                    </SheetHeader>
                    <UpdateRol onClose={handleCloseUpdate} id={idForUpdate}/>
                </SheetContent>
            </Sheet>

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
                            // onClick={handleDelete}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
