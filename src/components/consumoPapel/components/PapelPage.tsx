"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SelectFilter from "@/components/SelectFilter";
import {
  Building,
  File,
  FileSpreadsheet,
  Pen,
  Plus,
  Trash2,
} from "lucide-react";
import ButtonCalculate from "@/components/ButtonCalculate";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import {
  CollectionConsumoPapel,
  ConsumoPapelCollectionItem,
} from "@/components/consumoPapel/services/consumoPapel.interface";
import { FormPapel } from "@/components/consumoPapel/components/FormPapelOficce";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {
  useAnios,
  useConsumoPapelReport,
  useConsumosPapel,
  useSedes,
  useTipoPapel,
} from "@/components/consumoPapel/lib/consumoPapel.hook";
import { deleteConsumoPapel } from "../services/consumoPapel.actions";
import {
  errorToast,
  formatPeriod,
  successToast,
} from "@/lib/utils/core.function";
import { UpdateFormPapel } from "./UpdateFormPapelOficce";
import CustomPagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import GenerateReport from "@/lib/utils/generateReport";
import { ReportRequest } from "@/lib/interfaces/globals";
import ReportComponent from "@/components/ReportComponent";
import ExportPdfReport from "@/lib/utils/ExportPdfReport";
import usePageTitle from "@/lib/stores/titleStore.store";
import { ChangeTitle } from "@/components/TitleUpdater";
import { UploadFileComponent } from "@/components/uploadFile/components/UploadFile";

export default function PapelPage() {
  ChangeTitle("Consumo de Papel");

  const { push } = useRouter();
  const [page, setPage] = useState<number>(1);

  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //IDS
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  //SELECTS - FILTERS
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [selectedTipoPapel, setSelectedTipoPapel] = useState<string>("");
  const [from, setFrom] = useState<string>(new Date().getFullYear() + "-01");
  const [to, setTo] = useState<string>(new Date().getFullYear() + "-12");

  //HOOKS

  const consumoPapelQuery = useConsumosPapel({
    tipoPapelId: selectedTipoPapel ? Number(selectedTipoPapel) : undefined,
    sedeId: selectedSede ? Number(selectedSede) : undefined,
    from: from,
    to: to,
    page: page,
  });
  const tiposPapelQuery = useTipoPapel();
  const sedeQuery = useSedes();
  const aniosQuery = useAnios();

  // HANDLES
  const handleCloseFile = useCallback(async () => {
    await consumoPapelQuery.refetch();
  }, [consumoPapelQuery]);

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
      await consumoPapelQuery.refetch();
    },
    [consumoPapelQuery]
  );

  const handleTipoPapelChange = useCallback(
    async (value: string) => {
      await setSelectedTipoPapel(value);
      await consumoPapelQuery.refetch();
    },
    [consumoPapelQuery]
  );

  const handleFromChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setFrom(value);
      await consumoPapelQuery.refetch();
    },
    [consumoPapelQuery]
  );

  const handleToChange = useCallback(
    async (value: string) => {
      await setPage(1);
      await setTo(value);
      await consumoPapelQuery.refetch();
    },
    [consumoPapelQuery]
  );

  //   const handleAnioChange = useCallback(
  //     async (value: string) => {
  //       await setSelectedAnio(value);
  //       await consumoPapelQuery.refetch();
  //     },
  //     [consumoPapelQuery]
  //   );

  const handleCalculate = () => {
    push("/papel/calculos");
  };

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    consumoPapelQuery.refetch();
  }, [consumoPapelQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    consumoPapelQuery.refetch();
  }, [consumoPapelQuery]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteConsumoPapel(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data || error.response.data.message);
    } finally {
      await consumoPapelQuery.refetch();
    }
  }, [consumoPapelQuery]);

  const handlePageChage = async (page: number) => {
    await setPage(page);
    await consumoPapelQuery.refetch();
  };

  const ConsumoPapelReport = useConsumoPapelReport({
    tipoPapelId: selectedTipoPapel ? parseInt(selectedTipoPapel) : undefined,
    sedeId: parseInt(selectedSede),
    from: from,
    to: to,
  });

  const handleClickReport = useCallback(
    async (period: ReportRequest) => {
      const columns = [
        { header: "N°", key: "rn", width: 10 },
        { header: "TIPO PAPEL", key: "nombre", width: 20 },
        { header: "CANTIDAD", key: "cantidad_paquete", width: 15 },
        { header: "GRAMAJE", key: "gramaje", width: 15 },
        { header: "UNIDAD", key: "unidad_paquete", width: 20 },
        { header: "RECICLADO[%]", key: "porcentaje_reciclado", width: 20 },
        { header: "CERTIFICADO", key: "nombre_certificado", width: 15 },
        { header: "AÑO", key: "anio", width: 10 },
        { header: "SEDE", key: "sede", width: 20 },
      ];
      const data = await ConsumoPapelReport.refetch();
      await GenerateReport(
        data.data!.data,
        columns,
        formatPeriod(period, true),
        "REPORTE DE CONSUMO DE PAPEL",
        "Consumo de Papel"
      );
    },
    [ConsumoPapelReport]
  );

  const submitFormRef = useRef<{ submitForm: () => void } | null>(null);

  const handleClick = () => {
    if (submitFormRef.current) {
      submitFormRef.current.submitForm();
    }
  };

  if (
    sedeQuery.isLoading ||
    consumoPapelQuery.isLoading ||
    tiposPapelQuery.isLoading ||
    aniosQuery.isLoading ||
    ConsumoPapelReport.isLoading
  ) {
    return <SkeletonTable />;
  }

  if (
    sedeQuery.isError ||
    consumoPapelQuery.isError ||
    tiposPapelQuery.isError ||
    aniosQuery.isError ||
    ConsumoPapelReport.isError
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
                list={tiposPapelQuery.data!}
                itemSelected={selectedTipoPapel}
                handleItemSelect={handleTipoPapelChange}
                value={"id"}
                nombre={"nombreFiltro"}
                id={"id"}
                all={true}
                icon={<File className="h-3 w-3" />}
              />

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
                from={from}
                to={to}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                withMonth={true}
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
                data={ConsumoPapelReport.data!.data}
                fileName={`REPORTE DE PAPEL_${formatPeriod(
                  { from, to },
                  true
                )}`}
                columns={[
                  { header: "N°", key: "rn", width: 5 },
                  { header: "TIPO PAPEL", key: "nombre", width: 15 },
                  { header: "CANTIDAD", key: "cantidad_paquete", width: 10 },
                  { header: "GRAMAJE", key: "gramaje", width: 10 },
                  { header: "UNIDAD", key: "unidad_paquete", width: 15 },
                  {
                    header: "RECICLADO[%]",
                    key: "porcentaje_reciclado",
                    width: 10,
                  },
                  {
                    header: "CERTIFICADO",
                    key: "nombre_certificado",
                    width: 10,
                  },
                  { header: "AÑO", key: "anio", width: 10 },
                  { header: "SEDE", key: "sede", width: 15 },
                ]}
                title="REPORTE DE PAPEL"
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
                    <DialogTitle> CONSUMO PAPEL</DialogTitle>
                    <DialogDescription>
                      Registrar el consumo de papel
                    </DialogDescription>
                    <DialogClose />
                  </DialogHeader>
                  <FormPapel onClose={handleClose} />
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
                NOMBRE
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                PAQUETES
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                PESO TOTAL <span className="text-[10px]">[kg]</span>
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                MES
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
            {consumoPapelQuery.data?.data!.map(
              (item: ConsumoPapelCollectionItem, index: number) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{item.rn}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.nombre}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{item.cantidad_paquete}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default"> {item.peso}</Badge>
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
                        type="consumoPapel"
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

        {consumoPapelQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={consumoPapelQuery.data!.meta}
            onPageChange={handlePageChage}
          />
        )}
      </div>

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Registro de Papel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <UpdateFormPapel onClose={handleCloseUpdate} id={idForUpdate} />
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
