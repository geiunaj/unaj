"use client";

import {useCallback, useState} from "react";
import {Pen, Plus, Trash2, Building, PersonStanding} from "lucide-react";
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
import {User} from "@prisma/client";
import {useRol, useSede, useUser} from "../lib/user.hook";
import {UserCollectionItem} from "@/components/user/services/user.interface";
import SelectFilter from "@/components/SelectFilter";
import {ChangeTitle} from "@/components/TitleUpdater";
import {CreateUser} from "@/components/user/components/CreateUser";
import {deleteUser} from "@/components/user/services/user.actions";
import {UpdateUser} from "@/components/user/components/UpdateUser";

export default function UsuarioPage() {
    ChangeTitle("Usuarios");

    const [page, setPage] = useState(1);

    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    const [selectedSede, setSelectedSede] = useState<string>("");
    const [selectedTypeUser, setSelectedTypeUser] = useState<string>("");

    // USE QUERY
    const user = useUser({
        sedeId: selectedSede ? parseInt(selectedSede) : undefined,
        type_user_id: selectedTypeUser ? parseInt(selectedTypeUser) : undefined,
        page,
    });

    const sedes = useSede();
    const roles = useRol();

    // HANDLES
    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        user.refetch();
    }, [user]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        user.refetch();
    }, [user]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteUser(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        } finally {
            await user.refetch();
        }
    }, [user]);

    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await user.refetch();
    }, [user]);

    const handleRolChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedTypeUser(value);
        await user.refetch();
    }, [user]);

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    if (user.isLoading || sedes.isLoading || roles.isLoading) {
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
                <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <SelectFilter
                            list={sedes.data!}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            icon={<Building className="h-3 w-3"/>}
                            all={true}
                        />
                        <SelectFilter
                            list={roles.data!}
                            itemSelected={selectedTypeUser}
                            handleItemSelect={handleRolChange}
                            value={"id"}
                            nombre={"type_name"}
                            id={"id"}
                            icon={<PersonStanding className="h-3 w-3"/>}
                            all={true}
                        />
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Agregar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle>Usuario</DialogTitle>
                                    <DialogDescription>Agregar Usuario</DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <CreateUser onClose={handleClose}/>
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
                                EMAIL
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TELEFONO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                TIPO DE USUARIO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                SEDE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {user.data!.data.map((item: UserCollectionItem, index: number) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="secondary">{index + 1}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.name}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.email}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.telefono}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge
                                        variant="default">
                                        {item.type_user.type_name.charAt(0).toUpperCase() + item.type_user.type_name.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.sede?.name && (
                                        <Badge
                                            variant="secondary">
                                            {item.sede?.name}
                                        </Badge>
                                    )}
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
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Usuario</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateUser onClose={handleCloseUpdate} id={idForUpdate}/>
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
