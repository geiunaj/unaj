"use client";
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
import {Button, buttonVariants} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Pencil1Icon} from "@radix-ui/react-icons";
import {useCallback, useEffect, useState} from "react";
import {Plus, Trash2} from "lucide-react";
import {useSedeStore} from "@/components/sede/lib/sede.store";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import {useMesStore} from "@/components/mes/lib/mes.stores";
import {useElectricidadStore} from "../lib/electricidad.store";
import SelectFilter from "@/components/selectFilter";
import ButtonCalculate from "@/components/buttonCalculate";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {electricidadCollection} from "../services/electricidad.interface";
import {FormElectricidad} from "./FromElectricidad";
import {useRouter} from "next/navigation";
import {useAreaStore} from "@/components/area/lib/area.store";

export default function ElectricidadPage() {
    const {push} = useRouter();

    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    //STORES
    const {Electricidad, loadElectricidad, deleteElectricidad} =
        useElectricidadStore();
    const {sedes, loadSedes} = useSedeStore();
    const {meses, loadMeses} = useMesStore();
    const {anios, loadAnios} = useAnioStore();
    const {areas, loadAreas} = useAreaStore();

    //SELECT FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedArea, setSelectedArea] = useState<string>("1");
    const [selectedMes, setSelectedMes] = useState<string>("1");
    const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
        "desc"
    );

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
        if (Electricidad.length === 0) loadElectricidad({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
            areaId: Number(selectedArea),
        });
        if (sedes.length === 0) loadSedes();
        if (anios.length === 0) loadAnios();
        if (meses.length === 0) loadMeses();
        if (areas.length === 0) loadAreas();
    }, [loadElectricidad, meses, loadSedes, loadAnios, loadMeses, loadAreas, selectedSede, Electricidad.length, selectedAnio, selectedArea, sedes.length, anios.length, areas.length]);

    useEffect(() => {
        const currentYear = new Date().getFullYear().toString();

        if (anios.length > 0 && !selectedAnio) {
            const currentAnio = anios.find((anio) => anio.nombre === currentYear);
            if (currentAnio) {
                setSelectedAnio(currentAnio.id.toString());
            }
        }
        loadElectricidad({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
            areaId: Number(selectedArea),
        });
    }, [anios, selectedSede, selectedAnio, loadElectricidad, selectedArea]);

    const handleSedeChange = useCallback((value: string) => {
        setSelectedSede(value);
    }, []);

    const handleAnioChange = useCallback((value: string) => {
        setSelectedAnio(value);
    }, []);

    const handleAreaChange = useCallback((value: string) => {
        setSelectedArea(value);
    }, []);

    // const handleToggleCantidadSort = () => {
    //   setCantidadDirection(cantidadDirection === "asc" ? "desc" : "asc");
    //   loadElectricidad({
    //     sedeId: Number(selectedSede),
    //     sort: "cantidadElectricidad",
    //     direction: cantidadDirection === "asc" ? "desc" : "asc",
    //   });
    // };

    const handleCalculate = () => {
        push("/electricidad/calculos");
    };

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        loadElectricidad({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
            areaId: Number(selectedArea),
        });
    }, [loadElectricidad, selectedSede, selectedAnio, selectedArea]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        loadElectricidad({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
            areaId: Number(selectedArea),
        });
    }, [loadElectricidad, selectedSede, selectedAnio, selectedArea]);

    const handleDelete = useCallback(async () => {
        await deleteElectricidad(idForDelete);
        setIsDeleteDialogOpen(false);
        loadElectricidad({
            sedeId: Number(selectedSede),
            anioId: Number(selectedAnio),
            areaId: Number(selectedArea),
        });
    }, [deleteElectricidad, idForDelete, loadElectricidad, selectedSede, selectedAnio, selectedArea]);

    if (!Electricidad) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-gray-800 font-bold">Electricidad</h1>
                    <h2 className="text-xs sm:text-sm text-gray-500">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center w-1/2">
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

                        <SelectFilter
                            list={areas}
                            itemSelected={selectedArea}
                            handleItemSelect={handleAreaChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
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
                            <DialogContent className="max-w-md border-2">
                                <DialogHeader className="">
                                    <DialogTitle>Consumo de electricidad</DialogTitle>
                                    <DialogDescription>
                                        Indicar el consumo de electricidad
                                    </DialogDescription>
                                    <DialogClose></DialogClose>
                                </DialogHeader>
                                <FormElectricidad onClose={handleClose}/>
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
                                AREA
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                NÉMERO DE SUMINISTRO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                MES
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
                        {Electricidad.map((item: electricidadCollection) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    {item.area}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.numeroSuministro}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.consumo}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.mes}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    {item.anio}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
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
                        <DialogTitle>Actualizar Registro de Fertilizante</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    {/* <UpdateFormFertilizantes
            onClose={handleCloseUpdate}
            id={idForUpdate}
          /> */}
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
