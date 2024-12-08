import {Button, buttonVariants} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    Car,
    Building,
    FileSpreadsheet,
    LeafyGreen,
    CircleUser,
    Pen,
    Plus,
    Trash2,
} from "lucide-react";
import {FormTransporteCasaTrabajo} from "./FormTransporteCasaTrabajo";
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
import {
    TipoCasaTrabajo,
    TransporteCasaTrabajoCollectionItem
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.interface";
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
    useTransporteCasaTrabajo,
    useTransporteCasaTrabajoReport,
    useSede,
    useTipoVehiculos,
} from "@/components/transporteCasaTrabajo/lib/transporteCasaTrabajo.hook";
import {deleteTransporteCasaTrabajo} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.actions";
import {
    UpdateFormTransporteCasaTrabajo
} from "@/components/transporteCasaTrabajo/components/UpdateFormTransporteCasaTrabajo";
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
import usePageTitle from "@/lib/stores/titleStore.store";
import {ChangeTitle} from "@/components/TitleUpdater";

export default function TransporteCasaTrabajoPage() {
    ChangeTitle("Transporte Casa Trabajo");
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
    const [selectedTipoVehiculoId, setSelectedTipoVehiculoId] =
        useState<string>("");
    const [selectedTipo, setSelectedTipo] = useState<string>("");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedMes, setSelectedMes] = useState<string>("");
    const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
    const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

    // HOOKS
    const transporteCasaTrabajo = useTransporteCasaTrabajo({
        tipoVehiculoId: selectedTipoVehiculoId
            ? parseInt(selectedTipoVehiculoId)
            : undefined,
        tipo: selectedTipo,
        sedeId: parseInt(selectedSede),
        from,
        to,
        page: page,
    });

    const transporteCasaTrabajoReport = useTransporteCasaTrabajoReport({
        tipoVehiculoId: selectedTipoVehiculoId
            ? parseInt(selectedTipoVehiculoId)
            : undefined,
        sedeId: parseInt(selectedSede),
        from,
        to,
    });

    const COLUMS = [
        "N°",
        "NOMBRE",
        "CATEGORIA",
        "CANTIDAD | CONSUMIDA $ [kg]",
        "CONSUMO | TOTAL $ [kg]",
        "CANTIDAD | COMPRADA $ [kg]",
        "COSTO | TOTAL $ [S/.]",
        "AÑO",
        "MES",
        "ACCIONES",
    ];

    const tipoVehiculo = useTipoVehiculos();
    const sedes = useSede();
    const anios = useAnio();
    const meses = useMes();
    const tipos = [
        {nombre: "Alumno", upper: "ALUMNO"},
        {nombre: "Docente", upper: "DOCENTE"},
        {nombre: "Administrativo", upper: "ADMINISTRATIVO"},
    ];

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
            await transporteCasaTrabajo.refetch();
            await transporteCasaTrabajoReport.refetch();
        },
        [transporteCasaTrabajo, transporteCasaTrabajoReport]
    );

    const handleFromChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setFrom(value);
            await transporteCasaTrabajo.refetch();
            await transporteCasaTrabajoReport.refetch();
        }, [transporteCasaTrabajo, transporteCasaTrabajoReport]);

    const handleToChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setTo(value);
            await transporteCasaTrabajo.refetch();
            await transporteCasaTrabajoReport.refetch();
        }, [transporteCasaTrabajo, transporteCasaTrabajoReport]);

    const handleTipoTransporteCasaTrabajoChange = useCallback(
        async (value: string) => {
            await setPage(1);
            await setSelectedTipoVehiculoId(value);
            await transporteCasaTrabajo.refetch();
            await transporteCasaTrabajoReport.refetch();
        },
        [transporteCasaTrabajo, transporteCasaTrabajoReport]
    );

    const handleTipoChange = useCallback(async (value: string) => {
            await setPage(1);
            await setSelectedTipo(value);
            await transporteCasaTrabajo.refetch();
            await transporteCasaTrabajoReport.refetch();
        },
        [transporteCasaTrabajo, transporteCasaTrabajoReport]
    );

    const handleCalculate = () => {
        push("/transporte-casa-trabajo/calculos");
    };

    const handleClose = useCallback(async () => {
        setIsDialogOpen(false);
        await transporteCasaTrabajo.refetch();
        await transporteCasaTrabajoReport.refetch();
    }, [transporteCasaTrabajo, transporteCasaTrabajoReport]);

    const handleCloseUpdate = useCallback(async () => {
        setIsUpdateDialogOpen(false);
        await transporteCasaTrabajo.refetch();
        await transporteCasaTrabajoReport.refetch();
    }, [transporteCasaTrabajo, transporteCasaTrabajoReport]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTransporteCasaTrabajo(idForDelete);
            setIsDeleteDialogOpen(false);
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
        await transporteCasaTrabajo.refetch();
        await transporteCasaTrabajoReport.refetch();
    }, [transporteCasaTrabajo, transporteCasaTrabajoReport, idForDelete]);

    const handlePageChage = async (page: number) => {
        await setPage(page);
        await transporteCasaTrabajo.refetch();
    };

    const handleClickReport = useCallback(
        async (period: ReportRequest) => {
            const columns = [
                {header: "N°", key: "rn", width: 15},
                {header: "TIPO", key: "tipo", width: 20},
                {header: "TIPO VEHICULO", key: "tipoVehiculo", width: 20},
                {header: "KM RECORRIDO", key: "kmRecorrido", width: 20},
                {header: "AÑO", key: "anio", width: 20},
                {header: "MES", key: "mes", width: 20},
                {header: "SEDE", key: "sede", width: 20},
            ];
            const data = await transporteCasaTrabajoReport.refetch();
            await GenerateReport(
                data.data!.data,
                columns,
                formatPeriod(period, true),
                "REPORTE DE TRANSPORTE CASA TRABAJO",
                "Transporte Casa Trabajo"
            );
        },
        [transporteCasaTrabajoReport]
    );

    const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

    const handleClick = () => {
        if (submitFormRef.current) {
            submitFormRef.current.submitForm();
        }
    };

    if (
        transporteCasaTrabajo.isLoading ||
        tipoVehiculo.isLoading ||
        sedes.isLoading ||
        anios.isLoading ||
        transporteCasaTrabajoReport.isLoading || meses.isLoading
    ) {
        return <SkeletonTable/>;
    }

    if (
        transporteCasaTrabajo.isError ||
        tipoVehiculo.isError ||
        sedes.isError ||
        anios.isError ||
        transporteCasaTrabajoReport.isError || meses.isError
    ) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div className="w-full max-w-screen-xl h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-start mb-6">
                <div className="flex flex-col items-end w-full gap-2">
                    <div
                        className="grid grid-cols-2 grid-rows-1 w-full gap-2 sm:flex sm:justify-between justify-center">
                        <div
                            className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-start sm:items-center">

                            <SelectFilter
                                list={tipos}
                                itemSelected={selectedTipo}
                                handleItemSelect={handleTipoChange}
                                value={"upper"}
                                nombre={"nombre"}
                                id={"nombre"}
                                all={true}
                                icon={<CircleUser className="h-3 w-3"/>}
                            />

                            <SelectFilter
                                list={tipoVehiculo.data!}
                                itemSelected={selectedTipoVehiculoId}
                                handleItemSelect={handleTipoTransporteCasaTrabajoChange}
                                value={"id"}
                                nombre={"nombre"}
                                id={"id"}
                                all={true}
                                icon={<Car className="h-3 w-3"/>}
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
                                data={transporteCasaTrabajoReport.data!.data}
                                fileName={`REPORTE DE TRANSPORTE CASA TRABAJO_${formatPeriod({
                                    from,
                                    to,
                                }, true)}`}
                                columns={[
                                    {header: "N°", key: "rn", width: 5},
                                    {header: "TIPO", key: "tipo", width: 15},
                                    {header: "TIPO VEHICULO", key: "tipoVehiculo", width: 25},
                                    {header: "KM RECORRIDO", key: "kmRecorrido", width: 20},
                                    {header: "AÑO", key: "anio", width: 10},
                                    {header: "MES", key: "mes", width: 10},
                                    {header: "SEDE", key: "sede", width: 15},
                                ]}
                                title="REPORTE DE TRANSPORTE CASA TRABAJO"
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
                                        <DialogTitle>Registro Transporte Casa Trabajo</DialogTitle>
                                        <DialogClose></DialogClose>
                                    </DialogHeader>
                                    <FormTransporteCasaTrabajo onClose={handleClose}/>
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
                            <TableHead className="font-Manrope text-xs font-bold text-center py-1">
                                N°
                            </TableHead>
                            <TableHead className="font-Manrope text-xs font-bold text-center py-1">
                                TIPO
                            </TableHead>
                            <TableHead className="font-Manrope text-xs leading-3 font-bold text-center py-1">
                                TIPO DE<br/> VEHICULO
                            </TableHead>
                            <TableHead className="font-Manrope text-xs leading-3 font-bold text-center py-1">
                                KM<br/> RECORRIDO
                            </TableHead>
                            <TableHead className="font-Manrope text-xs font-bold text-center py-1">
                                AÑO
                            </TableHead>
                            <TableHead className="font-Manrope text-xs font-bold text-center py-1">
                                MES
                            </TableHead>
                            <TableHead className="font-Manrope text-xs font-bold text-center py-1">
                                ACCIONES
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transporteCasaTrabajo.data!.data.map(
                            (item: TransporteCasaTrabajoCollectionItem, index: number) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-xs">
                                        <Badge variant="secondary">
                                            {item.rn}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className="text-xs w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.tipo}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.tipoVehiculo}
                                    </TableCell>
                                    <TableCell
                                        className="text-xs max-w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                                        <Badge variant="default">{item.kmRecorrido}</Badge>
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
                {transporteCasaTrabajo.data!.meta.totalPages > 1 && (
                    <CustomPagination
                        meta={transporteCasaTrabajo.data!.meta}
                        onPageChange={handlePageChage}
                    />
                )}
            </div>

            {/*MODAL UPDATE*/}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Registro de Transporte Casa Trabajo</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <UpdateFormTransporteCasaTrabajo
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
