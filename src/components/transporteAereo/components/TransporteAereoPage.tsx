"use client";
import React, {useState, useCallback, useRef} from "react";
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
import {TransporteAereoCollectionItem} from "../service/transporteAereo.interface";
import {deleteTransporteAereo} from "../service/transporteAereo.actions";
import {
    useAnios,
    useSedes,
} from "@/components/consumoPapel/lib/consumoPapel.hook";
import {useMeses} from "@/components/consumoElectricidad/lib/electricidadCalculos.hooks";
import {useTransporteAereo} from "../lib/transporteAereo.hook";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {Badge} from "@/components/ui/badge";
import {FormTransporteAereo} from "./FormTransporteAereo";
import {UpdateFormTransporteAereo} from "./UpdateFromTransporteAereo";
import GenerateReport from "@/lib/utils/generateReport";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import CustomPagination from "@/components/Pagination";
import {useRouter} from "next/navigation";
import {ReportRequest} from "@/lib/interfaces/globals";
import ButtonCalculate from "@/components/ButtonCalculate";
import ReportComponent from "@/components/ReportComponent";
import {useConsumibleReport} from "@/components/consumibles/lib/consumible.hook";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";

export default function TransporteAereoPage() {
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
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    const sedeQuery = useSedes();
    const mesQuery = useMeses();
    const anioQuery = useAnios();
    const transporteAereoQuery = useTransporteAereo({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from: from,
        to: to,
        page: page,
    });

    const transporteAereoReport = useTransporteAereo({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from: from,
        to: to,
    });

    // HANDLES
    const handleSedeChange = useCallback(
        async (value: string) => {
            await setSelectedSede(value);
            await setPage(1);
            await transporteAereoQuery.refetch();
        },
        [transporteAereoQuery]
    );

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await transporteAereoQuery.refetch();
            await transporteAereoReport.refetch();
        }, [transporteAereoQuery, transporteAereoReport]);

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setTo(value);
            await transporteAereoQuery.refetch();
            await transporteAereoReport.refetch();
        }, [transporteAereoQuery, transporteAereoReport]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        transporteAereoQuery.refetch();
    }, [transporteAereoQuery]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        transporteAereoQuery.refetch();
    }, [transporteAereoQuery]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTransporteAereo(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data);
        } finally {
            await transporteAereoQuery.refetch();
        }
    }, [transporteAereoQuery]);

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
        await GenerateReport(transporteAereoQuery.data!.data, columns, formatPeriod(period), "REPORTE DE TAXIS CONTRATADOS", "TransporteAereos Contratados");
    };

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    const handleCalculate = () => {
        push("/transporteAereo/calculos");
    };

    if (
        sedeQuery.isLoading ||
        anioQuery.isLoading ||
        mesQuery.isLoading ||
        transporteAereoQuery.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        sedeQuery.isError ||
        anioQuery.isError ||
        mesQuery.isError ||
        transporteAereoQuery.isError
    ) {
        return <div>Error</div>;
    }

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await transporteAereoQuery.refetch();
    };

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-row justify-between items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Transporte Aereo Contratados</h1>
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

                        <ReportComponent
                            onSubmit={handleClickReport}
                            ref={submitFormRef}
                            withMonth={true}
                            from={from}
                            to={to}
                            handleFromChange={handleFromChange}
                            handleToChange={handleToChange}
                        />

                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
                        <Button
                            onClick={handleClick}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2 h-7"
                        >
                            <FileSpreadsheet className="h-3.5 w-3.5"/>
                            Excel
                        </Button>

                        <ExportPdfReport
                            data={transporteAereoReport.data!.data}
                            fileName={`REPORTE DE CONSUMIBLES_${formatPeriod({
                                from,
                                to,
                            }, true)}`}
                            columns={[
                                {header: "N°", key: "rn", width: 5},
                                {header: "TIPO", key: "categoria", width: 20},
                                {
                                    header: "CONSUMIBLE",
                                    key: "tipoConsumible",
                                    width: 25,
                                },
                                {header: "GRUPO", key: "grupo", width: 20},
                                {header: "PROCESO", key: "proceso", width: 10},
                                {header: "PESO TOTAL", key: "pesoTotal", width: 10},
                                {header: "UNIDAD", key: "unidad", width: 10},
                                {header: "AÑO", key: "anio", width: 10},
                                {header: "MES", key: "mes", width: 10},
                                {header: "SEDE", key: "sede", width: 10},
                            ]}
                            title="REPORTE DE CONSUMIBLES"
                            period={formatPeriod({from, to}, true)}
                        />

                        <ButtonCalculate onClick={handleCalculate}/>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <Plus className="h-3.5 w-3.5"/>
                                    Registrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-2">
                                <DialogHeader>
                                    <DialogTitle>Transporte Aéreo</DialogTitle>
                                    <DialogDescription>
                                        Registrar el transporte aéreo contratado.
                                    </DialogDescription>
                                    <DialogClose/>
                                </DialogHeader>
                                <FormTransporteAereo onClose={handleClose}/>
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
                                LUGAR DE<br/> SALIDA
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                LUGAR DE<br/> DESTINO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FECHA DE<br/> SALIDA
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FECHA DE<br/> REGRESO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                DISTANCIA<br/> TRAMO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                KM <br/>RECORRIDO
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
                        {transporteAereoQuery.data!.data.map(
                            (item: TransporteAereoCollectionItem, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{item.rn}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.origen}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.destino}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.fechaSalida?.toString()}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {item.fechaRegreso?.toString()}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="secondary">{item.distanciaTramo}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">{item.kmRecorrido}</Badge>
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
                {transporteAereoQuery.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={transporteAereoQuery.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar registro de transporteAereo contratados</DialogTitle>
                        <DialogDescription>
                            Indicar el historial de transporteAereo contratados.
                        </DialogDescription>
                    </DialogHeader>
                    <UpdateFormTransporteAereo onClose={handleCloseUpdate} id={idForUpdate}/>
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
