"use client";
import {useState, useCallback} from "react";
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
import {FormCombustible} from "./FormCombustible";
import {
    Building, Flame, Plus, Trash2, Calendar, CalendarDays, Pen,
} from "lucide-react";
import {
    CombustionCollection, CombustionCollectionItem,
    CombustionProps,
} from "../services/combustion.interface";
import {Badge} from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {UpdateFormCombustible} from "./UpdateFormCombustible";
import SelectFilter from "@/components/selectFilter";
import ButtonCalculate from "@/components/buttonCalculate";
import {useRouter} from "next/navigation";
import {
    useAnio,
    useCombustible,
    useMes,
    useSede,
    useTipoCombustible
} from "@/components/combustion/lib/combustion.hook";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {deleteCombustion} from "@/components/combustion/services/combustion.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import CustomPagination from "@/components/pagination";

export default function CombustiblePage({combustionType}: CombustionProps) {
    const {tipo} = combustionType;
    const [page, setPage] = useState<number>(1);
    //   NAVIGATION
    const {push} = useRouter();

    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // SELECTS - FILTERS
    const [selectTipoCombustible, setSelectTipoCombustible] =
        useState<string>("");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedMes, setSelectedMes] = useState<string>("");

    // HOOKS
    const combustible = useCombustible({
        tipo,
        tipoCombustibleId: selectTipoCombustible ? Number(selectTipoCombustible) : undefined,
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        anio: selectedAnio ? Number(selectedAnio) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        page,
    });
    const tiposCombustible = useTipoCombustible();
    const sedes = useSede();
    const anios = useAnio();
    const meses = useMes();

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

    const handleTipoCombustibleChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectTipoCombustible(value);
        await combustible.refetch();
    }, [combustible]);

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await combustible.refetch();
    }, [combustible]);

    const handleAnioChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedAnio(value);
        await combustible.refetch();
    }, [combustible]);

    const handleMesChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedMes(value);
        await combustible.refetch();
    }, [combustible]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        combustible.refetch();
    }, [combustible]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        combustible.refetch();
    }, [combustible]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteCombustion(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
        await combustible.refetch();
    }, [idForDelete, combustible]);

    const handleCalculate = () => {
        push(`/combustion-${tipo}/calculos`);
    };

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await combustible.refetch();
    }

    if (combustible.isLoading || tiposCombustible.isLoading || sedes.isLoading || anios.isLoading || meses.isLoading) {
        return <SkeletonTable/>;
    }

    if (combustible.isError || tiposCombustible.isError || sedes.isError || anios.isError || meses.isError) {
        errorToast("Error al cargar los datos");
        return <SkeletonTable/>;
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
                            list={tiposCombustible.data!}
                            itemSelected={selectTipoCombustible}
                            handleItemSelect={handleTipoCombustibleChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Flame className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={sedes.data!}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            icon={<Building className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={anios.data!}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Calendar className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={meses.data!}
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
                                <FormCombustible onClose={handleClose} tipo={tipo}/>
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
                                N°
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                TIPO DE EQUIPO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm  font-bold text-center">
                                TIPO DE COMBUSTIBLE
                            </TableHead>
                            <TableHead className="text-center">
                                CONSUMO
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
                        {combustible.data!.data.map((item: CombustionCollectionItem, index: number) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="secondary">{index + 1}</Badge>
                                </TableCell>
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
                {
                    combustible.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={combustible.data!.meta} onPageChange={handlePageChage}/>
                    )
                }
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
                    <UpdateFormCombustible
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
    <CombustiblePage combustionType={{tipo: "estacionaria"}}/>
);
export const CombustionMovilPage = () => (
    <CombustiblePage combustionType={{tipo: "movil"}}/>
);
