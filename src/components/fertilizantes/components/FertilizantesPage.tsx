import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useCallback, useRef, useState } from "react";
import {
  Bean,
  Building,
  FileSpreadsheet,
  LeafyGreen,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import { FormFertilizantes } from "./FormFertilizantes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { fertilizanteCollectionItem } from "../services/fertilizante.interface";
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
import { useRouter } from "next/navigation";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
  useAnio,
  useClaseFertilizante,
  useFertilizante,
  useFertilizanteReport,
  useSede,
  useTipoFertilizante,
} from "@/components/fertilizantes/lib/fertilizante.hook";
import { deleteFertilizante } from "@/components/fertilizantes/services/fertilizante.actions";
import { UpdateFormFertilizantes } from "@/components/fertilizantes/components/UpdateFormFertilizante";
import CustomPagination from "@/components/Pagination";
import {
  errorToast,
  formatPeriod,
  successToast,
} from "@/lib/utils/core.function";
import GenerateReport from "@/lib/utils/generateReport";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import { ReportRequest } from "@/lib/interfaces/globals";

export default function FertilizantePage() {
  // NAVIGATION
  const { push } = useRouter();
  const [page, setPage] = useState(1);

  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //IDS
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  //SELECTS - FILTERS
  const [selectedTipoFertilizanteId, setSelectedTipoFertilizanteId] =
    useState<string>("");
  const [selectedClaseFertilizante, setSelectedClaseFertilizante] =
    useState<string>("Orgánico");
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [yearFrom, setYearFrom] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [yearTo, setYearTo] = useState<string>(
    new Date().getFullYear().toString()
  );

  // HOOKS
  const fertilizante = useFertilizante({
    tipoFertilizanteId: selectedTipoFertilizanteId
      ? parseInt(selectedTipoFertilizanteId)
      : undefined,
    claseFertilizante: selectedClaseFertilizante,
    sedeId: parseInt(selectedSede),
    yearFrom: yearFrom,
    yearTo: yearTo,
    page: page,
  });

  const fertilizanteReport = useFertilizanteReport({
    tipoFertilizanteId: selectedTipoFertilizanteId
      ? parseInt(selectedTipoFertilizanteId)
      : undefined,
    claseFertilizante: selectedClaseFertilizante,
    sedeId: parseInt(selectedSede),
    yearFrom: yearFrom,
    yearTo: yearTo,
  });

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

  const handleClaseFertilizanteChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setSelectedClaseFertilizante(value);
      await setSelectedTipoFertilizanteId("");
      await tipoFertilizante.refetch();
      await fertilizante.refetch();
      await fertilizanteReport.refetch();
    },
    [fertilizante, fertilizanteReport, tipoFertilizante]
  );

  const handleSedeChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setSelectedSede(value);
      await fertilizante.refetch();
      await fertilizanteReport.refetch();
    },
    [fertilizante, fertilizanteReport]
  );

  const handleYearFromChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setYearFrom(value);
      await fertilizante.refetch();
      await fertilizanteReport.refetch();
    },
    [fertilizante, fertilizanteReport]
  );

  const handleYearToChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setYearTo(value);
      await fertilizante.refetch();
      await fertilizanteReport.refetch();
    },
    [fertilizante, fertilizanteReport]
  );

  const handleTipoFertilizanteChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setSelectedTipoFertilizanteId(value);
      await fertilizante.refetch();
      await fertilizanteReport.refetch();
    },
    [fertilizante, fertilizanteReport]
  );

  const handleCalculate = () => {
    push("/fertilizante/calculos");
  };

  const handleClose = useCallback(async () => {
    setIsDialogOpen(false);
    await fertilizante.refetch();
    await fertilizanteReport.refetch();
  }, [fertilizante, fertilizanteReport]);

  const handleCloseUpdate = useCallback(async () => {
    setIsUpdateDialogOpen(false);
    await fertilizante.refetch();
    await fertilizanteReport.refetch();
  }, [fertilizante, fertilizanteReport]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteFertilizante(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
    await fertilizante.refetch();
    await fertilizanteReport.refetch();
  }, [fertilizante, fertilizanteReport, idForDelete]);

  const handlePageChage = async (page: number) => {
    await setPage(page);
    await fertilizante.refetch();
  };

  const handleClickReport = useCallback(
    async (period: ReportRequest) => {
      const columns = [
        { header: "N°", key: "id", width: 10 },
        { header: "TIPO", key: "clase", width: 15 },
        { header: "FERTILIZANTE", key: "tipoFertilizante", width: 40 },
        { header: "CANTIDAD", key: "cantidad", width: 15 },
        { header: "NITRÓGENO %", key: "porcentajeNit", width: 20 },
        { header: "FICHA TECNICA", key: "is_ficha", width: 15 },
        { header: "AÑO", key: "anio", width: 15 },
        { header: "SEDE", key: "sede", width: 20 },
      ];
      const data = await fertilizanteReport.refetch();
      await GenerateReport(
        data.data!.data,
        columns,
        formatPeriod(period),
        "REPORTE DE FERTILIZANTES",
        "Fertilizantes"
      );
    },
    [fertilizanteReport]
  );

  const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

  const handleClick = () => {
    if (submitFormRef.current) {
      submitFormRef.current.submitForm();
    }
  };

  if (
    fertilizante.isLoading ||
    claseFertilizante.isLoading ||
    tipoFertilizante.isLoading ||
    sedes.isLoading ||
    anios.isLoading ||
    fertilizanteReport.isLoading
  ) {
    return <SkeletonTable />;
  }

  if (
    fertilizante.isError ||
    claseFertilizante.isError ||
    tipoFertilizante.isError ||
    sedes.isError ||
    anios.isError ||
    fertilizanteReport.isError
  ) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full ">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div className="font-Manrope">
          <h1 className="text-base text-foreground font-bold">Fertilizantes</h1>
          <h2 className="text-xs sm:text-sm text-muted-foreground">
            Huella de carbono
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="grid grid-cols-2 grid-rows-1 w-full sm:flex sm:flex-col sm:justify-end sm:items-end gap-1 justify-center">
            <div className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-end sm:items-center">
              <SelectFilter
                list={claseFertilizante.data!}
                itemSelected={selectedClaseFertilizante}
                handleItemSelect={handleClaseFertilizanteChange}
                value={"nombre"}
                nombre={"nombre"}
                id={"nombre"}
                icon={<LeafyGreen className="h-3 w-3" />}
              />

              <SelectFilter
                list={tipoFertilizante.data!}
                itemSelected={selectedTipoFertilizanteId}
                handleItemSelect={handleTipoFertilizanteChange}
                value={"id"}
                nombre={"nombre"}
                id={"id"}
                all={true}
                icon={<Bean className="h-3 w-3" />}
              />

              <SelectFilter
                list={sedes.data!}
                itemSelected={selectedSede}
                handleItemSelect={handleSedeChange}
                value={"id"}
                nombre={"name"}
                id={"id"}
                icon={<Building className="h-3 w-3" />}
              />

              <ReportComponent
                onSubmit={handleClickReport}
                ref={submitFormRef}
                yearFrom={yearFrom}
                yearTo={yearTo}
                handleYearFromChange={handleYearFromChange}
                handleYearToChange={handleYearToChange}
              />
            </div>
            <div className="flex flex-col-reverse justify-end gap-1 w-full sm:flex-row sm:gap-2">
              <Button
                onClick={handleClick}
                size="sm"
                variant="outline"
                className="flex items-center gap-2 h-7"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Excel
              </Button>

              <ExportPdfReport
                data={fertilizanteReport.data!.data}
                fileName={`REPORTE DE FERTILIZANTES_${formatPeriod({
                  yearFrom,
                  yearTo,
                })}`}
                columns={[
                  { header: "N°", key: "rn", width: 5 },
                  { header: "TIPO", key: "clase", width: 20 },
                  {
                    header: "FERTILIZANTE",
                    key: "tipoFertilizante",
                    width: 25,
                  },
                  { header: "CANTIDAD", key: "cantidad", width: 20 },
                  { header: "NITRÓGENO %", key: "porcentajeNit", width: 10 },
                  { header: "AÑO", key: "anio", width: 10 },
                  { header: "SEDE", key: "sede", width: 10 },
                ]}
                title="REPORTE DE FERTILIZANTES"
                period={formatPeriod({ yearFrom, yearTo })}
              />

              <ButtonCalculate onClick={handleCalculate} />

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-7 gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Registrar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg border-2">
                  <DialogHeader className="">
                    <DialogTitle>Registro Fertilizante</DialogTitle>
                    <DialogClose></DialogClose>
                  </DialogHeader>
                  <FormFertilizantes onClose={handleClose} />
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
            {fertilizante.data!.data.map(
              (item: fertilizanteCollectionItem, index: number) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">
                      {10 * (page - 1) + index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.clase}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.tipoFertilizante}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default">{item.cantidad}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.porcentajeNit} %
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.is_ficha}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.anio}
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
                        <Pen className="h-3.5 text-blue-700" />
                      </Button>

                      {/*DELETE*/}
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        variant="outline"
                        onClick={() => handleCLickDelete(item.id)}
                      >
                        <Trash2 className="h-3.5 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        {fertilizante.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={fertilizante.data!.meta}
            onPageChange={handlePageChage}
          />
        )}
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
              className={buttonVariants({ variant: "destructive" })}
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
