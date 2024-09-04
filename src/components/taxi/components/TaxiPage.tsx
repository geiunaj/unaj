"use client";
import {useState, useCallback} from "react";
import {Button, buttonVariants} from "@/components/ui/button";

import {
    Building,
    Calendar,
    FileSpreadsheet,
    Pen,
    Plus,
    Trash2,
} from "lucide-react";

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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import SelectFilter from "@/components/SelectFilter";
import {TaxiCollectionItem} from "../service/taxi.interface";
import {deleteTaxi} from "../service/taxi.actions";
import {
    useAnios,
    useSedes,
} from "@/components/consumoPapel/lib/consumoPapel.hook";
import {useMeses} from "@/components/consumoElectricidad/lib/electricidadCalculos.hooks";
import {useTaxi} from "../lib/taxi.hook";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {Badge} from "@/components/ui/badge";
import {FormTaxi} from "./FormTaxi";
import {UpdateFormTaxi} from "./UpdateFromTaxi";
import GenerateReport from "@/lib/utils/generateReport";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CustomPagination from "@/components/Pagination";
import {useRouter} from "next/navigation";
import {ReportRequest} from "@/lib/interfaces/globals";

export default function TaxiPage() {
    //NAVIGATION
    const {push} = useRouter();
    const [page, setPage] = useState<number>(1);

    // DIALOGS
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [idForUpdate, setIdForUpdate] = useState<number>(0);
    const [idForDelete, setIdForDelete] = useState<number>(0);

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedMes, setSelectedMes] = useState<string>("");

    const sedeQuery = useSedes();
    const mesQuery = useMeses();
    const anioQuery = useAnios();
    const taxiQuery = useTaxi({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        anioId: selectedAnio ? Number(selectedAnio) : undefined,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        page: page,
    });

    // HANDLES
    const handleSedeChange = useCallback(
        async (value: string) => {
            await setSelectedSede(value);
            await taxiQuery.refetch();
        },
        [taxiQuery]
    );

    const handleAnioChange = useCallback(
        async (value: string) => {
            await setSelectedAnio(value);
            await taxiQuery.refetch();
        },
        [taxiQuery]
    );

    const handleMesChange = useCallback(
        async (value: string) => {
            await setSelectedMes(value);
            await taxiQuery.refetch();
        },
        [taxiQuery]
    );

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        taxiQuery.refetch();
    }, [taxiQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        taxiQuery.refetch();
    }, [taxiQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTaxi(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data);
        } finally {
            await taxiQuery.refetch();
        }
    }, [taxiQuery]);

    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleClickReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10},
            {header: "UNIDAD CONTRATANTE", key: "unidadContratante", width: 15},
            {header: "LUGAR SALIDA", key: "lugarSalida", width: 40},
            {header: "LUGAR DESTINO", key: "lugarDestino", width: 15},
            {header: "MONTO GASTADO", key: "montoGastado", width: 20},
            {header: "SEDE", key: "sede", width: 15},
            {header: "AÑO", key: "anio", width: 15},
            {header: "MESS", key: "mes", width: 20},
        ];
        await GenerateReport(taxiQuery.data!.data, columns, formatPeriod(period), "REPORTE DE TAXIS CONTRATADOS", "Taxis Contratados");
    };

    if (
        sedeQuery.isLoading ||
        anioQuery.isLoading ||
        mesQuery.isLoading ||
        taxiQuery.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        sedeQuery.isError ||
        anioQuery.isError ||
        mesQuery.isError ||
        taxiQuery.isError
    ) {
        return <div>Error</div>;
    }

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await taxiQuery.refetch();
    };

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-row justify-between items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Taxi Contratados</h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">Huella de carbono</h2>
                </div>
                <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
                        <SelectFilter
                            list={sedeQuery.data!}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            icon={<Building className="h-3 w-3"/>}
                            all={true}
                        />

                        <SelectFilter
                            list={anioQuery.data!}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                            icon={<Calendar className="h-3 w-3"/>}
                            all={true}
                        />
                        <SelectFilter
                            list={mesQuery.data!}
                            itemSelected={selectedMes}
                            handleItemSelect={handleMesChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                            icon={<Calendar className="h-3 w-3"/>}
                            all={true}
                        />
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        {/* <ButtonCalculate onClick={handleCalculate} /> */}

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle>Taxis Contratados</DialogTitle>
                                    <DialogDescription>
                                        Registrar el taxi contratado.
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <FormTaxi onClose={handleClose}/>
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
                        {taxiQuery.data!.data.map(
                            (item: TaxiCollectionItem, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{index + 1}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.unidadContratante}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.lugarSalida}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.lugarDestino}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">{item.montoGastado}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.mes}
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
                            )
                        )}
                    </TableBody>
                </Table>
                {taxiQuery.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={taxiQuery.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar registro de taxi contratados</DialogTitle>
                        <DialogDescription>
                            Indicar el historial de taxi contratados.
                        </DialogDescription>
                    </DialogHeader>
                    <UpdateFormTaxi onClose={handleCloseUpdate} id={idForUpdate}/>
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
