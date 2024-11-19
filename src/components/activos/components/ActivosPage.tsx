import {Button, buttonVariants} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, {useCallback, useRef, useState} from "react";
import {
    Bean,
    Building,
    FileSpreadsheet,
    LeafyGreen,
    Pen,
    Plus,
    Trash2,
} from "lucide-react";
import {FormActivo} from "./FormActivo";
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
import {ActivoCollectionItem} from "@/components/activos/services/activo.interface";
import SelectFilter from "@/components/SelectFilter";
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
import ButtonCalculate from "@/components/ButtonCalculate";
import {useRouter} from "next/navigation";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
    useAnio,
    useActivo,
    useActivoReport,
    useSede,
    useTipoActivo,
} from "@/components/activos/lib/activo.hook";
import {deleteActivo} from "@/components/activos/services/activos.actions";
import {UpdateFormActivo} from "@/components/activos/components/UpdateFormActivo";
import CustomPagination from "@/components/Pagination";
import {
    errorToast,
    formatPeriod,
    successToast,
} from "@/lib/utils/core.function";
import GenerateReport from "@/lib/utils/generateReport";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import {ReportRequest} from "@/lib/interfaces/globals";
import {useMes} from "@/components/combustion/lib/combustion.hook";

export default function ActivosPage() {
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
    const [selectedTipoActivoId, setSelectedTipoActivoId] =
        useState<string>("");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedMes, setSelectedMes] = useState<string>("");
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const activo = useActivo({
        tipoActivoId: selectedTipoActivoId
            ? parseInt(selectedTipoActivoId)
            : undefined,
        sedeId: parseInt(selectedSede),
        from,
        to,
        page: page,
    });

    const activoReport = useActivoReport({
        tipoActivoId: selectedTipoActivoId
            ? parseInt(selectedTipoActivoId)
            : undefined,
        sedeId: parseInt(selectedSede),
        from,
        to,
    });

    const tipoActivo = useTipoActivo();
    const sedes = useSede();
    const anios = useAnio();
    const meses = useMes();

    // HANDLE FUNCTIONS
    const handleClickUpdate = (id: number) => {
        setIdForUpdate(id);
        setIsUpdateDialogOpen(true);
    };

    const handleCLickDelete = (id: number) => {
        setIdForDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSedeChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedSede(value);
            await activo.refetch();
            await activoReport.refetch();
        },
        [activo, activoReport]
    );

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await activo.refetch();
            await activoReport.refetch();
        }, [activo, activoReport]);

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setTo(value);
            await activo.refetch();
            await activoReport.refetch();
        }, [activo, activoReport]);

    const handleTipoActivoChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedTipoActivoId(value);
            await activo.refetch();
            await activoReport.refetch();
        },
        [activo, activoReport]
    );

    const handleCalculate = () => {
        push("/activo/calculos");
    };

    const handleClose = useCallback(async () => {
        setIsDialogOpen(false);
        await activo.refetch();
        await activoReport.refetch();
    }, [activo, activoReport]);

    const handleCloseUpdate = useCallback(async () => {
        setIsUpdateDialogOpen(false);
        await activo.refetch();
        await activoReport.refetch();
    }, [activo, activoReport]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteActivo(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
        await activo.refetch();
        await activoReport.refetch();
    }, [activo, activoReport, idForDelete]);

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await activo.refetch();
    };

    const handleClickReport = useCallback(
        async (period: ReportRequest) => {
            const columns = [
                {header: "N°", key: "rn", width: 5},
                {header: "TIPO", key: "categoria", width: 25},
                {
                    header: "ACTIVO",
                    key: "tipoActivo",
                    width: 80,
                },
                {header: "GRUPO", key: "grupo", width: 20},
                {header: "PROCESO", key: "proceso", width: 90},
                {header: "PESO TOTAL", key: "pesoTotal", width: 20},
                {header: "UNIDAD", key: "unidad", width: 10},
                {header: "AÑO", key: "anio", width: 10},
                {header: "MES", key: "mes", width: 20},
                {header: "SEDE", key: "sede", width: 20},
            ];
            const data = await activoReport.refetch();
            await GenerateReport(
                data.data!.data,
                columns,
                formatPeriod(period, true),
                "REPORTE DE ACTIVOS",
                "Activos"
            );
        },
        [activoReport]
    );

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (
        activo.isLoading ||
        tipoActivo.isLoading ||
        sedes.isLoading ||
        anios.isLoading ||
        activoReport.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        activo.isError ||
        tipoActivo.isError ||
        sedes.isError ||
        anios.isError ||
        activoReport.isError
    ) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full ">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">Activos</h1>
                    <h2 className="text-xs text-muted-foreground">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full sm:flex sm:flex-col sm:justify-end sm:items-end gap-1 justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-end sm:items-center">

                            <SelectFilter
                                list={tipoActivo.data!}
                                itemSelected={selectedTipoActivoId}
                                handleItemSelect={handleTipoActivoChange}
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
                        <div className="flex flex-col-reverse justify-end gap-1 w-full sm:flex-row sm:gap-2">
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
                                data={activoReport.data!.data}
                                fileName={`REPORTE DE ACTIVOS_${formatPeriod({
                                    from,
                                    to,
                                }, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 5},
                                    {header: "TIPO", key: "categoria", width: 20},
                                    {
                                        header: "ACTIVO",
                                        key: "tipoActivo",
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
                                title="REPORTE DE ACTIVOS"
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
                                    <DialogHeader className="">
                                        <DialogTitle>Registro Activo</DialogTitle>
                                        <DialogClose></DialogClose>
                                    </DialogHeader>
                                    <FormActivo onClose={handleClose}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs font-bold text-center">
                                N°
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                TIPO
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                ACTIVO
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                GRUPO
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                PROCESO
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                PESO TOTAL
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                UNIDAD
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                AÑO
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                MES
                            </TableHead>
                            <TableHead className="text-xs font-bold text-center">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activo.data!.data.map(
                            (item: ActivoCollectionItem, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs">
                                        <Badge variant="secondary">
                                            {10 * (page - 1) + index + 1}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className="text-xs w-[20%]  whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.categoria}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs text-start max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.tipoActivo}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-24 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.grupo}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-48 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.proceso}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Badge variant="default">{item.pesoTotal}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {item.unidad}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {item.anio}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {item.mes}
                                    </TableCell>
                                    <TableCell className="text-xs p-1">
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
                            )
                        )}
                    </TableBody>
                </Table>
                {activo.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={activo.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Activo</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormActivo
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