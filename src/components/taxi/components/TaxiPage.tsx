"use client";
import {useEffect, useState, useCallback} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Pencil1Icon} from "@radix-ui/react-icons";
import {Pen, Plus, Trash2} from "lucide-react";

import {useSedeStore} from "@/components/sede/lib/sede.store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import SelectFilter from "@/components/selectFilter";
import {TaxiCollection} from "../service/taxi.interface";
import {usetaxiStore} from "../lib/taxi.store";
import {deleteTaxi} from "../service/taxi.actions";

export default function TaxiPage() {

    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // STORES
    const {taxi, loadtaxi, deletetaxi} = usetaxiStore();
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(new Date().getFullYear().toString());
    // const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">("desc");


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
    }

    useEffect(() => {
        if (sedes.length === 0) loadSedes();
        if (anios.length === 0) loadAnios();
    }, [loadSedes, loadAnios, sedes.length, anios.length,]);

    useEffect(() => {
        const currentYear = new Date().getFullYear().toString();

        if (anios.length > 0 && !selectedAnio) {
            const currentAnio = anios.find((anio) => anio.nombre === currentYear);
            if (currentAnio) {
                setSelectedAnio(currentAnio.id.toString());
            }
        }
        loadtaxi({
            sedeId: Number(selectedSede),
            anioId: selectedAnio ? Number(selectedAnio) : undefined,
        });
    }, [anios, selectedSede, selectedAnio, loadtaxi]);

    const handleSedeChange = useCallback((value: string) => {
        setSelectedSede(value);
    }, []);

    const handleAnioChange = useCallback((value: string) => {
        setSelectedAnio(value);
    }, []);

    // const handleToggleConsumoSort = useCallback(() => {
    //     setConsumoDirection((prevDirection) => {
    //         const newDirection = prevDirection === "asc" ? "desc" : "asc";
    //         loadCombustion({
    //             tipo,
    //             sedeId: Number(selectedSede),
    //             sort: "consumo",
    //             direction: newDirection,
    //         });
    //         return newDirection;
    //     });
    // }, [loadCombustion, tipo, selectedSede]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        loadtaxi({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
        });
    }, [loadtaxi, selectedSede, selectedAnio]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        loadtaxi({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
        });
    }, [loadtaxi, selectedSede, selectedAnio]);

    const handleDelete = useCallback(async () => {
        await deleteTaxi(idForDelete);
        setIsDeleteDialogOpen(false);
        loadtaxi({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
        });
    }, [deleteTaxi, idForDelete, loadtaxi, selectedSede, selectedAnio]);

    if (!taxi) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-row justify-between items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-xl text-gray-800 font-bold">
                        Taxi Contratados
                    </h1>
                    <h2 className="text-base text-gray-500">Huella de carbono</h2>
                </div>
                <div className="flex justify-end gap-5">
                    <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">

                        <SelectFilter
                            list={sedes}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                        />

                        <SelectFilter
                            list={anios}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                        />

                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <Plus/> Registrar
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Registro de taxi Contratados
                                </DialogTitle>
                                <DialogDescription>
                                    Indicar el historial de taxi contratados.
                                </DialogDescription>
                            </DialogHeader>
                            {/* <FormCombustible onClose={handleClose} /> */}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                UNIDAD CONTRATANTE
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                LUGAR DE SALIDA
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                LUGAR DE DESTINO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                MONTO GASTADO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                MES
                            </TableHead>
                            {/*<TableHead className="font-Manrope text-sm font-bold text-center">AÑO</TableHead>*/}
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {taxi.map((item: TaxiCollection) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell>{item.unidadContratante}</TableCell>
                                <TableCell>{item.lugarSalida}</TableCell>
                                <TableCell>{item.lugarDestino}</TableCell>
                                <TableCell>{item.monto}</TableCell>
                                <TableCell>{item.mes}</TableCell>

                                <TableCell>
                                    <div className="flex justify-center gap-4">
                                        {/*UPDATE*/}
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleClickUpdate(item.id)}
                                        >
                                            <Pen className="h-3.5 text-blue-700"/>
                                        </Button>

                                        {/*DELETE*/}
                                        <Button
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
                        <DialogTitle>
                            Actualizar registro de taxi contratados
                        </DialogTitle>
                        <DialogDescription>
                            Indicar el historial de taxi contratados.
                        </DialogDescription>
                    </DialogHeader>
                    {/* <UpdateFormCombustible
                        onClose={handleCloseUpdate}
                        id={idForUpdate}
                    /> */}
                </DialogContent>
            </Dialog>

            {/*    MODAL DELETE*/}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar registro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer, ¿Estás seguro de eliminar este registro?
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

