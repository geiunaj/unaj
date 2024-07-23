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
import {FormCombustion} from "./FormCombustion";
import {ChevronsUpDown, ListRestart, Plus, Trash2} from "lucide-react";
import {useCombustionStore} from "../lib/combustion.store";
import {
    CombustionCollection,
    CombustionProps,
} from "../services/combustion.interface";
import {useSedeStore} from "@/components/sede/lib/sede.store";
import {Badge} from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import {UpdateFormCombustion} from "./UpdateFormCombustion";
import {useTipoCombustibleStore} from "@/components/tipoCombustible/lib/tipoCombustible.store";
import SelectFilter from "@/components/selectFilter";

export default function CombustionPage({combustionType}: CombustionProps) {
    const {tipo} = combustionType;
    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // STORES
    const {combustion, loadCombustion, deleteCombustion} = useCombustionStore();
    const {tiposCombustible, loadTiposCombustible} = useTipoCombustibleStore();
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();

    // SELECTS - FILTERS
    const [selectTipoCombustible, setSelectTipoCombustible] = useState<string>("");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(new Date().getFullYear().toString());
    const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">("desc");


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
        if (tiposCombustible.length === 0) loadTiposCombustible();
        if (sedes.length === 0) loadSedes();
        if (anios.length === 0) loadAnios();
    }, [loadTiposCombustible, loadSedes, loadAnios, sedes.length, anios.length, tiposCombustible.length]);

    useEffect(() => {
        const currentYear = new Date().getFullYear().toString();

        if (anios.length > 0 && !selectedAnio) {
            const currentAnio = anios.find((anio) => anio.nombre === currentYear);
            if (currentAnio) {
                setSelectedAnio(currentAnio.id.toString());
            }
        }
        loadCombustion({
            tipo,
            sedeId: Number(selectedSede),
            anioId: selectedAnio ? Number(selectedAnio) : undefined,
            tipoCombustibleId: selectTipoCombustible ? Number(selectTipoCombustible) : undefined,
        });
    }, [loadCombustion, anios, tipo, selectedSede, selectedAnio, selectTipoCombustible]);

    const handleTipoCombustibleChange = useCallback((value: string) => {
        setSelectTipoCombustible(value);
    }, []);

    const handleSedeChange = useCallback((value: string) => {
        setSelectedSede(value);
    }, []);

    const handleAnioChange = useCallback((value: string) => {
        setSelectedAnio(value);
    }, []);

    const handleToggleConsumoSort = useCallback(() => {
        setConsumoDirection((prevDirection) => {
            const newDirection = prevDirection === "asc" ? "desc" : "asc";
            loadCombustion({
                tipo,
                sedeId: Number(selectedSede),
                sort: "consumo",
                direction: newDirection,
            });
            return newDirection;
        });
    }, [loadCombustion, tipo, selectedSede]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        loadCombustion({
            tipo,
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
        });
    }, [loadCombustion, tipo, selectedSede, selectedAnio]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        loadCombustion({
            tipo,
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
        });
    }, [loadCombustion, tipo, selectedSede, selectedAnio]);

    const handleDelete = useCallback(async () => {
        await deleteCombustion(idForDelete);
        setIsDeleteDialogOpen(false);
        loadCombustion({
            tipo,
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
        });
    }, [deleteCombustion, idForDelete, loadCombustion, tipo, selectedSede, selectedAnio]);

    if (!combustion) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-row justify-between items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-xl text-gray-800 font-bold">
                        {tipo === "estacionario"
                            ? "Combustión Estacionaria"
                            : "Combustión Móvil"}
                    </h1>
                    <h2 className="text-base text-gray-500">Huella de carbono</h2>
                </div>
                <div className="flex justify-end gap-5">
                    <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">

                        <SelectFilter
                            list={tiposCombustible}
                            itemSelected={selectTipoCombustible}
                            handleItemSelect={handleTipoCombustibleChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                        />
                        {selectTipoCombustible && (
                            <Button size="icon" variant="ghost" onClick={() => setSelectTipoCombustible("")}>
                                <ListRestart className="h-4 text-gray-500"/>
                            </Button>
                        )}

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
                                    {tipo === "estacionario"
                                        ? "Registro Estacionario"
                                        : "Registro Móvil"}
                                </DialogTitle>
                                <DialogDescription>
                                    Indicar el consumo de combustible de{" "}
                                    {tipo === "estacionario"
                                        ? "equipos estacionarios"
                                        : "equipos móviles"}
                                    .
                                </DialogDescription>
                            </DialogHeader>
                            <FormCombustion onClose={handleClose} tipo={tipo}/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                TIPO DE EQUIPO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                TIPO DE COMBUSTIBLE
                            </TableHead>
                            <TableHead className="text-center">
                                <Button
                                    className="font-Manrope text-sm font-bold text-center"
                                    variant="ghost"
                                    onClick={handleToggleConsumoSort}
                                >
                                    CONSUMO
                                    <ChevronsUpDown className="ml-2 h-3 w-3"/>
                                </Button>
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                UNIDAD
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
                        {combustion.map((item: CombustionCollection) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell>{item.tipoEquipo}</TableCell>
                                <TableCell>{item.tipoCombustible}</TableCell>
                                <TableCell>
                                    <Badge variant="default">{item.consumo}</Badge>
                                </TableCell>
                                <TableCell>{item.unidad}</TableCell>
                                <TableCell>{item.mes}</TableCell>

                                <TableCell className="p-1">
                                    <div className="flex justify-center gap-4">
                                        {/*UPDATE*/}
                                        <Button
                                            className="h-7 w-7"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleClickUpdate(item.id)}
                                        >
                                            <Pencil1Icon className="h-4 text-blue-700"/>
                                        </Button>

                                        {/*DELETE*/}
                                        <Button
                                            className="h-7 w-7"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleCLickDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 text-gray-500"/>
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
                            {tipo === "estacionario"
                                ? "Actualizar Combustible Estacionario"
                                : "Actualizar Combustible Móvil"}
                        </DialogTitle>
                        <DialogDescription>
                            Indicar el consumo de combustible de{" "}
                            {tipo === "estacionario"
                                ? "equipos estacionarios"
                                : "equipos móviles"}
                            .
                        </DialogDescription>
                    </DialogHeader>
                    <UpdateFormCombustion
                        onClose={handleCloseUpdate}
                        tipo={tipo}
                        id={idForUpdate}
                    />
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

export const CombustionEstacionariaPage = () => (
    <CombustionPage combustionType={{tipo: "estacionario"}}/>
);
export const CombustionMovilPage = () => (
    <CombustionPage combustionType={{tipo: "movil"}}/>
);
