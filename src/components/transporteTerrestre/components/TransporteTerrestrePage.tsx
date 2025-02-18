"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { TransporteTerrestreCollectionItem } from "../service/transporteTerrestre.interface";
import { deleteTransporteTerrestre } from "../service/transporteTerrestre.actions";
import {
  useAnios,
  useSedes,
} from "@/components/consumoPapel/lib/consumoPapel.hook";
import { useMeses } from "@/components/consumoElectricidad/lib/electricidadCalculos.hooks";
import {
  useTransporteTerrestre,
  useTransporteTerrestreReport,
} from "../lib/transporteTerrestre.hook";
import {
  errorToast,
  formatPeriod,
  successToast,
} from "@/lib/utils/core.function";
import SkeletonTable from "@/components/Layout/skeletonTable";
import { Badge } from "@/components/ui/badge";
import { FormTransporteTerrestre } from "./FormTransporteTerrestre";
import { UpdateFormTransporteTerrestre } from "./UpdateFromTransporteTerrestre";
import GenerateReport from "@/lib/utils/generateReport";
import CustomPagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { ReportRequest } from "@/lib/interfaces/globals";
import ButtonCalculate from "@/components/ButtonCalculate";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import usePageTitle from "@/lib/stores/titleStore.store";
import { ChangeTitle } from "@/components/TitleUpdater";
import { UploadFileComponent } from "@/components/uploadFile/components/UploadFile";

export default function TransporteTerrestrePage() {
  ChangeTitle("Transporte Terrestre");

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
  const [selectedAnio, setSelectedAnio] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedMes, setSelectedMes] = useState<string>("");
  const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
  const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

  const sedeQuery = useSedes();
  const mesQuery = useMeses();
  const anioQuery = useAnios();
  const transporteTerrestreQuery = useTransporteTerrestre({
    sedeId: selectedSede ? Number(selectedSede) : undefined,
    from: from,
    to: to,
    page: page,
  });

  const transporteTerrestreReport = useTransporteTerrestreReport({
    sedeId: selectedSede ? Number(selectedSede) : undefined,
    from: from,
    to: to,
  });

  // HANDLES
  
  const handleCloseFile = useCallback(async () => {
    await transporteTerrestreQuery.refetch();
  }, [transporteTerrestreQuery]);

  const handleSedeChange = useCallback(
    async (value: string) => {
      await setSelectedSede(value);
      await setPage(1);
      await transporteTerrestreQuery.refetch();
    },
    [transporteTerrestreQuery]
  );

  const handleFromChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setFrom(value);
      await transporteTerrestreQuery.refetch();
      await transporteTerrestreReport.refetch();
    },
    [transporteTerrestreQuery, transporteTerrestreReport]
  );

  const handleToChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setTo(value);
      await transporteTerrestreQuery.refetch();
      await transporteTerrestreReport.refetch();
    },
    [transporteTerrestreQuery, transporteTerrestreReport]
  );

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    transporteTerrestreQuery.refetch();
  }, [transporteTerrestreQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    transporteTerrestreQuery.refetch();
  }, [transporteTerrestreQuery]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteTransporteTerrestre(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data || error.response.data.message);
    } finally {
      await transporteTerrestreQuery.refetch();
    }
  }, [transporteTerrestreQuery]);

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
      { header: "N°", key: "rn", width: 10 },
      { header: "LUGAR SALIDA", key: "origen", width: 25 },
      { header: "LUGAR DESTINO", key: "destino", width: 25 },
      { header: "FECHA SALIDA", key: "fechaSalida", width: 20 },
      { header: "FECHA REGRESO", key: "fechaRegreso", width: 20 },
      { header: "DISTANCIA", key: "distancia", width: 20 },
      { header: "MES", key: "mes", width: 15 },
      { header: "AÑO", key: "anio", width: 15 },
    ];
    await GenerateReport(
      transporteTerrestreReport.data!.data,
      columns,
      formatPeriod(period),
      "REPORTE DE TRANSPORTE TERRESTRE",
      "Transporte Terrestres"
    );
  };

  const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

  const handleClick = () => {
    if (submitFormRef.current) {
      submitFormRef.current.submitForm();
    }
  };

  const handleCalculate = () => {
    push("/transporte-terrestre/calculos");
  };

  if (
    sedeQuery.isLoading ||
    anioQuery.isLoading ||
    mesQuery.isLoading ||
    transporteTerrestreQuery.isLoading ||
    transporteTerrestreReport.isLoading
  ) {
    return <SkeletonTable />;
  }

  if (
    sedeQuery.isError ||
    anioQuery.isError ||
    mesQuery.isError ||
    transporteTerrestreQuery.isError ||
    transporteTerrestreReport.isError
  ) {
    return <div>Error</div>;
  }

  const handlePageChage = async (page: number) => {
    await setPage(page);
    await transporteTerrestreQuery.refetch();
  };

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
                data={transporteTerrestreReport.data!.data}
                fileName={`REPORTE DE TRANSPORTE TERRESTRE_${formatPeriod(
                  {
                    from,
                    to,
                  },
                  true
                )}`}
                columns={[
                  { header: "N°", key: "rn", width: 5 },
                  { header: "LUGAR SALIDA", key: "origen", width: 20 },
                  { header: "LUGAR DESTINO", key: "destino", width: 20 },
                  { header: "FECHA SALIDA", key: "fechaSalida", width: 10 },
                  { header: "FECHA REGRESO", key: "fechaRegreso", width: 10 },
                  { header: "DISTANCIA", key: "distancia", width: 15 },
                  { header: "MES", key: "mes", width: 10 },
                  { header: "AÑO", key: "anio", width: 10 },
                ]}
                title="REPORTE DE TRANSPORTE TERRESTRE"
                rows={25}
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
                    <DialogTitle>Transporte Terrestre</DialogTitle>
                    <DialogDescription>
                      Registrar el transporte terrestre contratado.
                    </DialogDescription>
                    <DialogClose />
                  </DialogHeader>
                  <FormTransporteTerrestre onClose={handleClose} />
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
                LUGAR DE
                <br /> SALIDA
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                LUGAR DE
                <br /> DESTINO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                FECHA DE
                <br /> SALIDA
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                FECHA DE
                <br /> REGRESO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                PASAJEROS
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
            {transporteTerrestreQuery.data!.data.map(
              (item: TransporteTerrestreCollectionItem, index: number) => (
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
                    <Badge variant="secondary">{item.numeroPasajeros}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default">{item.distancia}</Badge>
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
                        type="transporteTerrestre"
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
        {transporteTerrestreQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={transporteTerrestreQuery.data!.meta}
            onPageChange={handlePageChage}
          />
        )}
      </div>

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Actualizar registro de Transporte Terrestre
            </DialogTitle>
            <DialogDescription>
              Indicar el historial de Transporte Terrestre
            </DialogDescription>
          </DialogHeader>
          <UpdateFormTransporteTerrestre
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
