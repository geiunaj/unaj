import {Button, buttonVariants} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {useCallback, useState} from "react";
import {Bean, Building, Calendar, LeafyGreen, Pen, Plus, Trash2} from "lucide-react";
import {FormFertilizantes} from "./FormFertilizantes";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {fertilizanteCollection, fertilizanteCollectionItem} from "../services/fertilizante.interface";
import SelectFilter from "@/components/selectFilter";
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
import ButtonCalculate from "@/components/buttonCalculate";
import {useRouter} from "next/navigation";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    useAnio,
    useClaseFertilizante,
    useFertilizante,
    useSede, useTipoFertilizante
} from "@/components/fertilizantes/lib/fertilizante.hook";
import {deleteFertilizante} from "@/components/fertilizantes/services/fertilizante.actions";
import {UpdateFormFertilizantes} from "@/components/fertilizantes/components/UpdateFormFertilizante";
import ReactPaginate from "react-paginate";
import CustomPagination from "@/components/pagination";


export default function FertilizantePage() {
    // NAVIGATION
    const {push} = useRouter();
    const [page, setPage] = useState(1);

    //DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    //IDS
    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    //SELECTS - FILTERS
    const [selectedTipoFertilizanteId, setSelectedTipoFertilizanteId] = useState<string>("");
    const [selectedClaseFertilizante, setSelectedClaseFertilizante] =
        useState<string>("Orgánico");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );

    // HOOKS
    const fertilizante = useFertilizante(
        {
            tipoFertilizanteId: selectedTipoFertilizanteId ? parseInt(selectedTipoFertilizanteId) : undefined,
            claseFertilizante: selectedClaseFertilizante,
            sedeId: parseInt(selectedSede),
            anio: selectedAnio,
            page: page,
        }
    );
    const tipoFertilizante = useTipoFertilizante(selectedClaseFertilizante);
    const claseFertilizante = useClaseFertilizante();
    const sedes = useSede();
    const anios = useAnio();


    // HANDLE FUNCTIONS
    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleclaseFertilizanteChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedClaseFertilizante(value);
        await setSelectedTipoFertilizanteId("");
        await fertilizante.refetch();
        await tipoFertilizante.refetch();
    }, [fertilizante, tipoFertilizante]);

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await fertilizante.refetch();
    }, [fertilizante]);

    const handleAnioChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedAnio(value);
        await fertilizante.refetch();
    }, [fertilizante]);

    const handleTipoFertilizanteChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedTipoFertilizanteId(value);
        await fertilizante.refetch();
    }, [fertilizante]);

    const handleCalculate = () => {
        push("/fertilizante/calculos");
    };

    const handleClose = useCallback(async () => {
        setIsDialogOpen(false);
        await fertilizante.refetch();
    }, [fertilizante]);

    const handleCloseUpdate = useCallback(async () => {
        setIsUpdateDialogOpen(false);
        await fertilizante.refetch();
    }, [fertilizante]);

    const handleDelete = useCallback(async () => {
        await deleteFertilizante(idForDelete);
        setIsDeleteDialogOpen(false);
        await fertilizante.refetch();
    }, [fertilizante, idForDelete]);

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await fertilizante.refetch();
    }

    if (fertilizante.isLoading || claseFertilizante.isLoading || tipoFertilizante.isLoading
        || sedes.isLoading || anios.isLoading) {
        return <SkeletonTable/>;
    }

    if (fertilizante.isError || claseFertilizante.isError || tipoFertilizante.isError
        || sedes.isError || anios.isError) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-gray-800 font-bold">Fertilizantes</h1>
                    <h2 className="text-xs sm:text-sm text-gray-500">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
                        <SelectFilter
                            list={claseFertilizante.data!}
                            itemSelected={selectedClaseFertilizante}
                            handleItemSelect={handleclaseFertilizanteChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"nombre"}
                            icon={<LeafyGreen className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={tipoFertilizante.data!}
                            itemSelected={selectedTipoFertilizanteId}
                            handleItemSelect={handleTipoFertilizanteChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            all={true}
                            icon={<Bean className="h-3 w-3"/>}
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
                            icon={<Calendar className="h-3 w-3"/>}
                            all={true}
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
                                    <DialogTitle>Fertilizante</DialogTitle>
                                    <DialogDescription>
                                        Indicar el consumo de fertilizantes por tipo y considerar
                                        aquellos usados en prácticas agronómicas y/o mantenimiento
                                        de áreas verdes.
                                    </DialogDescription>
                                    <DialogClose></DialogClose>
                                </DialogHeader>
                                <FormFertilizantes onClose={handleClose}/>
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
                                FERTILIZANTE
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                {/*<Button variant="ghost" onClick={handleToggleCantidadSort}>*/}
                                CANTIDAD
                                {/*<ChevronsUpDown className="ml-2 h-3 w-3"/>*/}
                                {/*</Button>*/}
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                % DE NITROGENO
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm font-bold text-center">
                                FICHA TECNICA
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
                        {fertilizante.data!.data.map((item: fertilizanteCollectionItem, index: number) => (
                            <TableRow key={item.id} className="text-center">
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="secondary">{index + 1}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.clase}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.tipoFertilizante}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                    <Badge variant="default">{item.cantidad}</Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.porcentajeNit} %</TableCell>
                                <TableCell className="text-xs sm:text-sm">{item.is_ficha ? "SI" : "NO"}</TableCell>
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
                    fertilizante.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={fertilizante.data!.meta} onPageChange={handlePageChage}/>
                    )
                }
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Fertilizante</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormFertilizantes
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
