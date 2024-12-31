"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";

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
import { TaxiCollectionItem } from "../service/taxi.interface";
import { deleteTaxi } from "../service/taxi.actions";
import {
  useAnios,
  useSedes,
} from "@/components/consumoPapel/lib/consumoPapel.hook";
import { useMeses } from "@/components/consumoElectricidad/lib/electricidadCalculos.hooks";
import { useTaxi, useTaxiReport } from "../lib/taxi.hook";
import {
  errorToast,
  formatPeriod,
  successToast,
} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import { Badge } from "@/components/ui/badge";
import { FormTaxi } from "./FormTaxi";
import { UpdateFormTaxi } from "./UpdateFromTaxi";
import GenerateReport from "@/lib/utils/generateReport";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomPagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { ReportRequest } from "@/lib/interfaces/globals";
import ButtonCalculate from "@/components/ButtonCalculate";
import usePageTitle from "@/lib/stores/titleStore.store";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import { useFertilizanteReport } from "@/components/fertilizantes/lib/fertilizante.hook";
import ReportComponent from "@/components/ReportComponent";
import { ChangeTitle } from "@/components/TitleUpdater";
import { UploadFileComponent } from "@/components/uploadFile/components/UploadFile";

export default function TaxiPage() {
  ChangeTitle("Taxis");

  //NAVIGATION
  const { push } = useRouter();
  const [page, setPage] = useState<number>(1);

  // DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  // SELECTS - FILTERS
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [selectedMes, setSelectedMes] = useState<string>("");
  const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
  const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

  // HOOKS
  const sedeQuery = useSedes();
  const mesQuery = useMeses();
  const taxiQuery = useTaxi({
    sedeId: selectedSede ? Number(selectedSede) : undefined,
    from,
    to,
    mesId: selectedMes ? Number(selectedMes) : undefined,
    page: page,
  });

  const taxiReport = useTaxiReport({
    sedeId: selectedSede ? Number(selectedSede) : undefined,
    from,
    to,
    mesId: selectedMes ? Number(selectedMes) : undefined,
  });

  // HANDLES
  const handleCloseFile = useCallback(async () => {
    await taxiQuery.refetch();
  }, [taxiQuery]);

  const handleSedeChange = useCallback(
    async (value: string) => {
      await setSelectedSede(value);
      await taxiQuery.refetch();
      await taxiReport.refetch();
    },
    [taxiQuery, taxiReport]
  );

  const handleMesChange = useCallback(
    async (value: string) => {
      await setSelectedMes(value);
      await taxiQuery.refetch();
      await taxiReport.refetch();
    },
    [taxiQuery, taxiReport]
  );

  const handleFromChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setFrom(value);
      await taxiQuery.refetch();
      await taxiReport.refetch();
    },
    [taxiQuery, taxiReport]
  );

  const handleToChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setTo(value);
      await taxiQuery.refetch();
      await taxiReport.refetch();
    },
    [taxiQuery, taxiReport]
  );

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    taxiQuery.refetch();
    taxiReport.refetch();
  }, [taxiQuery, taxiReport]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    taxiQuery.refetch();
    taxiReport.refetch();
  }, [taxiQuery, taxiReport]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteTaxi(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data || error.response.data.message);
    } finally {
      await taxiQuery.refetch();
      await taxiReport.refetch();
    }
  }, [taxiQuery, taxiReport]);

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
      { header: "N°", key: "id", width: 10 },
      { header: "UNIDAD CONTRATANTE", key: "unidadContratante", width: 25 },
      { header: "LUGAR SALIDA", key: "lugarSalida", width: 20 },
      { header: "LUGAR DESTINO", key: "lugarDestino", width: 20 },
      { header: "MONTO GASTADO", key: "montoGastado", width: 20 },
      { header: "KM RECORRIDO", key: "kmRecorrido", width: 20 },
      { header: "SEDE", key: "sede", width: 20 },
      { header: "AÑO", key: "anio", width: 15 },
      { header: "MES", key: "mes", width: 20 },
    ];
    await GenerateReport(
      taxiReport.data!.data,
      columns,
      formatPeriod(period, true),
      "REPORTE DE TAXIS CONTRATADOS",
      "Taxis Contratados"
    );
  };

  const handleCalculate = () => {
    push("/taxi/calculos");
  };

  const handlePageChage = async (page: number) => {
    await setPage(page);
    await taxiQuery.refetch();
    await taxiReport.refetch();
  };

  const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

  const handleClick = () => {
    if (submitFormRef.current) {
      submitFormRef.current.submitForm();
    }
  };

  if (
    sedeQuery.isLoading ||
    mesQuery.isLoading ||
    taxiQuery.isLoading ||
    taxiReport.isLoading
  ) {
    return <SkeletonTable />;
  }

  if (
    sedeQuery.isError ||
    mesQuery.isError ||
    taxiQuery.isError ||
    taxiReport.isError
  ) {
    return <div>Error</div>;
  }

  return (
    <div className="w-full max-w-screen-xl h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-start mb-6">
        <div className="flex flex-col items-end w-full gap-2">
          <div className="grid grid-cols-2 grid-rows-1 w-full gap-2 sm:flex sm:justify-between justify-center">
            <div className="flex flex-col gap-1 w-full font-normal sm:flex-row sm:gap-2 sm:justify-start sm:items-center">
              <SelectFilter
                list={sedeQuery.data!}
                itemSelected={selectedSede}
                handleItemSelect={handleSedeChange}
                value={"id"}
                nombre={"name"}
                id={"id"}
                icon={<Building className="h-3 w-3" />}
                all={true}
              />

              <SelectFilter
                list={mesQuery.data!}
                itemSelected={selectedMes}
                handleItemSelect={handleMesChange}
                value={"id"}
                nombre={"nombre"}
                id={"id"}
                icon={<Calendar className="h-3 w-3" />}
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
                data={taxiReport.data!.data}
                fileName={`REPORTE DE TAXIS_${formatPeriod({
                  from,
                  to,
                })}`}
                columns={[
                  { header: "N°", key: "id", width: 10 },
                  {
                    header: "UNIDAD CONTRATANTE",
                    key: "unidadContratante",
                    width: 20,
                  },
                  { header: "LUGAR SALIDA", key: "lugarSalida", width: 20 },
                  { header: "LUGAR DESTINO", key: "lugarDestino", width: 20 },
                  { header: "MONTO GASTADO", key: "montoGastado", width: 20 },
                  { header: "KM RECORRIDO", key: "kmRecorrido", width: 20 },
                  { header: "SEDE", key: "sede", width: 20 },
                  { header: "AÑO", key: "anio", width: 15 },
                  { header: "MES", key: "mes", width: 20 },
                ]}
                rows={25}
                title="REPORTE DE TAXIS CONTRATADOS"
                period={formatPeriod({ from, to }, true)}
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
                  <DialogHeader>
                    <DialogTitle>Taxis Contratados</DialogTitle>
                    <DialogDescription>
                      Registrar el taxi contratado.
                    </DialogDescription>
                    <DialogClose />
                  </DialogHeader>
                  <FormTaxi onClose={handleClose} />
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
              <TableHead className="font-Manrope text-sm font-bold text-center">
                UNIDAD <br />
                CONTRATANTE
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                LUGAR DE
                <br /> SALIDA
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                LUGAR DE
                <br /> DESTINO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                MONTO
                <br />
                GASTADO <span className="text-[10px]">[S/]</span>
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                KM <br />
                RECORRIDO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                MES
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                AÑO
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
                    <Badge variant="secondary">{item.rn}</Badge>
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
                    <Badge variant="secondary">{item.montoGastado}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default">{item.kmRecorrido}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.mes}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.anio}
                  </TableCell>

                  <TableCell className="text-xs sm:text-sm p-1">
                    <div className="flex justify-center gap-4">
                      {/*FILES*/}
                      <UploadFileComponent
                        type="taxi"
                        id={item.id}
                        handleClose={handleCloseFile}
                        filesUploaded={item.File}
                      />

                      {/*UPDATE*/}
                      <Button
                        className="h-7 w-7"
                        size="icon"
                        variant="outline"
                        onClick={() => handleClickUpdate(item.id)}
                      >
                        <Pen className="h-3.5 text-primary" />
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
          <UpdateFormTaxi onClose={handleCloseUpdate} id={idForUpdate} />
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
