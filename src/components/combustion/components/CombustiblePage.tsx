"use client";
import React, {useState, useCallback, useRef} from "react";
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
    Building, Flame, Plus, Trash2, CalendarDays, Pen, FileSpreadsheet,
} from "lucide-react";
import {CombustionCollectionItem, CombustionProps} from "../services/combustion.interface";
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
import SelectFilter from "@/components/SelectFilter";
import ButtonCalculate from "@/components/ButtonCalculate";
import {useRouter} from "next/navigation";
import {
    useAnio,
    useCombustible, useCombustibleReport,
    useMes,
    useSede,
    useTipoCombustible
} from "@/components/combustion/lib/combustion.hook";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {deleteCombustion} from "@/components/combustion/services/combustion.actions";
import {errorToast, formatPeriod, successToast} from "@/lib/utils/core.function";
import CustomPagination from "@/components/Pagination";
import GenerateReport from "@/lib/utils/generateReport";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import ReportComponent from "@/components/ReportComponent";
import {ReportRequest} from "@/lib/interfaces/globals";

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
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const combustible = useCombustible({
        tipo,
        tipoCombustibleId: selectTipoCombustible ? Number(selectTipoCombustible) : undefined,
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
        mesId: selectedMes ? Number(selectedMes) : undefined,
        page,
    });

    const combustibleReport = useCombustibleReport({
        tipo,
        tipoCombustibleId: selectTipoCombustible ? Number(selectTipoCombustible) : undefined,
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        from,
        to,
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
        await combustibleReport.refetch();
    }, [combustible, combustibleReport]);

    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await combustible.refetch();
        await combustibleReport.refetch();
    }, [combustible, combustibleReport]);

    const handleMesChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedMes(value);
        await combustible.refetch();
        await combustibleReport.refetch();
    }, [combustible, combustibleReport]);

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await combustible.refetch();
            await combustibleReport.refetch();
        }, [combustible, combustibleReport]);

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setTo(value);
            await combustible.refetch();
            await combustibleReport.refetch();
        }, [combustible, combustibleReport]);

    const handleClose = useCallback(() => {
        setIsDialogOpen(false);
        combustible.refetch();
        combustibleReport.refetch();
    }, [combustible, combustibleReport]);

    const handleCloseUpdate = useCallback(() => {
        setIsUpdateDialogOpen(false);
        combustible.refetch();
        combustibleReport.refetch();
    }, [combustible, combustibleReport]);

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

    const handlePageChange = async (page: number) => {
        await setPage(page);
        await combustible.refetch();
        await combustibleReport.refetch();
    }

    const handleClickExcelReport = async (period: ReportRequest) => {
        const columns = [
            {header: "N°", key: "id", width: 10,},
            {header: "TIPO", key: "tipo", width: 15,},
            {header: "TIPO DE EQUIPO", key: "tipoEquipo", width: 20,},
            {header: "CONSUMO", key: "consumo", width: 15,},
            {header: "MES", key: "mes", width: 20,},
            {header: "AÑO", key: "anio", width: 15,},
            {header: "TIPO DE COMBUSTIBLE", key: "tipoCombustible", width: 30,},
            {header: "UNIDAD", key: "unidad", width: 10,},
            {header: "SEDE", key: "sede", width: 20,}
        ];
        await setFrom(period.from ?? "");
        await setTo(period.to ?? "");
        const data = await combustibleReport.refetch();
        await GenerateReport(data.data!.data, columns, formatPeriod(period, true), `REPORTE DE COMBUSTIÓN ${tipo.toUpperCase()}`, `Combustión ${tipo}`);
    }

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (combustible.isLoading || tiposCombustible.isLoading || sedes.isLoading || anios.isLoading || meses.isLoading || combustibleReport.isLoading) {
        return <SkeletonTable/>;
    }

    if (combustible.isError || tiposCombustible.isError || sedes.isError || anios.isError || meses.isError || combustibleReport.isError) {
        errorToast("Error al cargar los datos");
        return <SkeletonTable/>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                <div className="font-Manrope">
                    <h1 className="text-base text-foreground font-bold">
                        {tipo === "estacionaria"
                            ? "Combustión Estacionaria"
                            : "Combustión Móvil"}
                    </h1>
                    <h2 className="text-xs sm:text-sm text-muted-foreground">
                        Huella de carbono
                    </h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full sm:flex sm:flex-col sm:justify-end sm:items-end gap-1 justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-end sm:items-center">
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
                                list={meses.data!}
                                itemSelected={selectedMes}
                                handleItemSelect={handleMesChange}
                                value={"id"}
                                nombre={"nombre"}
                                id={"id"}
                                all={true}
                                icon={<CalendarDays className="h-3 w-3"/>}
                            />

                            <ReportComponent
                                onSubmit={handleClickExcelReport}
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
                                data={combustibleReport.data!.data}
                                fileName={`REPORTE DE COMBUSTIÓN ${tipo.toUpperCase()}_${formatPeriod({
                                    from,
                                    to
                                }, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 5,},
                                    {header: "TIPO", key: "tipo", width: 10,},
                                    {header: "TIPO DE EQUIPO", key: "tipoEquipo", width: 20,},
                                    {header: "CONSUMO", key: "consumo", width: 10,},
                                    {header: "MES", key: "mes", width: 10,},
                                    {header: "AÑO", key: "anio", width: 5,},
                                    {header: "TIPO DE COMBUSTIBLE", key: "tipoCombustible", width: 20,},
                                    {header: "UNIDAD", key: "unidad", width: 10,},
                                    {header: "SEDE", key: "sede", width: 10,}
                                ]}
                                title={`REPORTE DE COMBUSTIÓN ${tipo.toUpperCase()}`}
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
                        <CustomPagination meta={combustible.data!.meta} onPageChange={handlePageChange}/>
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
