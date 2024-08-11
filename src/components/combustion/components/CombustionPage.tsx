"use client";
import {useEffect, useState, useCallback} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {FormCombustion} from "./FormCombustion";
import {
    Building, ChevronsUpDown, Flame, Plus, Trash2, Calendar, CalendarDays, Pen,
} from "lucide-react";
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
import ButtonCalculate from "@/components/buttonCalculate";
import {useRouter} from "next/navigation";
import {useMesStore} from "@/components/mes/lib/mes.stores";

export default function CombustionPage({combustionType}: CombustionProps) {
    const {tipo} = combustionType;

    //   NAVIGATION
    const {push} = useRouter();

    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // STORES
    const {combustion, loadCombustion, deleteCombustion} = useCombustionStore();
    const {tiposCombustible, loadTiposCombustible} = useTipoCombustibleStore();
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();
    const {meses, loadMeses} = useMesStore();

    // SELECTS - FILTERS
    const [selectTipoCombustible, setSelectTipoCombustible] =
        useState<string>("");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedMes, setSelectedMes] = useState<string>("");

    const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
        "desc"
    );

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

    useEffect(() => {
        if (tiposCombustible.length === 0) loadTiposCombustible();
        if (sedes.length === 0) loadSedes();
        if (anios.length === 0) loadAnios();
        if (meses.length === 0) loadMeses();
    }, [
        loadTiposCombustible,
        loadSedes,
        loadAnios,
        loadMeses,
        sedes.length,
        anios.length,
        tiposCombustible.length,
        meses.length,
    ]);

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
            mesId: selectedMes ? Number(selectedMes) : undefined,
            tipoCombustibleId: selectTipoCombustible
                ? Number(selectTipoCombustible)
                : undefined,
        });
    }, [loadCombustion, anios, tipo, selectedSede, selectedAnio, selectTipoCombustible, selectedMes]);

    const handleTipoCombustibleChange = useCallback((value: string) => {
        setSelectTipoCombustible(value);
    }, []);

    const handleSedeChange = useCallback((value: string) => {
        setSelectedSede(value);
    }, []);

    const handleAnioChange = useCallback((value: string) => {
        setSelectedAnio(value);
    }, []);

    const handleMesChange = useCallback((value: string) => {
        setSelectedMes(value);
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
    }, [
        deleteCombustion,
        idForDelete,
        loadCombustion,
        tipo,
        selectedSede,
        selectedAnio,
    ]);

    const handleCalculate = () => {
        push(`/combustion-${tipo}/calculos`);
    };

    if (!combustion) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-gray-800 font-bold">
                        {tipo === "estacionaria"
                            ? "Combustión Estacionaria"
                            : "Combustión Móvil"}
                    </h1>
                    <h2 className="text-xs sm:text-sm text-gray-500">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
                        <SelectFilter
                            list={tiposCombustible}
                            itemSelected={selectTipoCombustible}
                            handleItemSelect={handleTipoCombustibleChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Flame className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={sedes}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            icon={<Building className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={anios}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Calendar className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={meses}
                            itemSelected={selectedMes}
                            handleItemSelect={handleMesChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<CalendarDays className="h-3 w-3"/>}
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
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {tipo === "estacionaria"
                                            ? "Registro Estacionaria"
                                            : "Registro Móvil"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Indicar el consumo de combustible de{" "}
                                        {tipo === "estacionaria"
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
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                TIPO DE EQUIPO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                TIPO DE COMBUSTIBLE
                            </TableHead>
                            <TableHead className="text-center">
                                <Button
                                    className="text-xs sm:text-sm  font-bold text-center"
                                    variant="ghost"
                                    onClick={handleToggleConsumoSort}
                                >
                                    CONSUMO
                                    <ChevronsUpDown className="ml-2 h-3 w-3"/>
                                </Button>
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                UNIDAD
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                MES
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                AÑO
                            </TableHead>
                            {/*<TableHead className="font-Manrope text-xs sm:text-sm  font-bold text-center">AÑO</TableHead>*/}
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {combustion.map((item: CombustionCollection) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    {item.tipoEquipo}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.tipoCombustible}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="default">{item.consumo}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.unidad}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.mes}</TableCell>
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
                        <DialogTitle>
                            {tipo === "estacionaria"
                                ? "Actualizar Combustible Estacionaria"
                                : "Actualizar Combustible Móvil"}
                        </DialogTitle>
                        <DialogDescription>
                            Indicar el consumo de combustible de{" "}
                            {tipo === "estacionaria"
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

export const CombustionEstacionariaPage = () => (
    <CombustionPage combustionType={{tipo: "estacionaria"}}/>
);
export const CombustionMovilPage = () => (
    <CombustionPage combustionType={{tipo: "movil"}}/>
);
