"use client";

import React, { useCallback, useState } from "react";
import { Flame, Pen, Plus, Trash2 } from "lucide-react";
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
import SkeletonTable from "@/components/Layout/skeletonTable";
import { errorToast, successToast } from "@/lib/utils/core.function";
import CustomPagination from "@/components/Pagination";

import { UpdateFormTipoCombustible } from "@/components/tipoCombustible/components/UpdateFormTipoCombustible";
import SelectFilter from "@/components/SelectFilter";
import { useFactorEmisionSEINPaginate } from "../lib/factorEmisionSEIN.hook";
import { useAnio } from "@/components/combustion/lib/combustion.hook";
import { FactorEmisionSEINCollection } from "../services/factorEmisionSEIN.interface";

export default function FactorEmisionSEINPage() {
  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  const [selectAnio, setSelectAnio] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  //USE QUERIES
  const factoremisionSEINQuery = useFactorEmisionSEINPaginate({
    anioId: selectAnio,
    page,
    perPage: 10,
  });

  const aniosQuery = useAnio();

  // HANDLES
  const handleAnio = useCallback(
    async (value: string) => {
      await setPage(1);
      await setSelectAnio(value);
      await factoremisionSEINQuery.refetch();
    },
    [factoremisionSEINQuery]
  );

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    factoremisionSEINQuery.refetch();
  }, [factoremisionSEINQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    factoremisionSEINQuery.refetch();
  }, [factoremisionSEINQuery]);

  // const handleDelete = useCallback(async () => {
  //     try {
  //         const response = await deleteFactorEmisionSEIN(idForDelete);
  //         setIsDeleteDialogOpen(false);
  //         successToast(response.data.message);
  //     } catch (error: any) {
  //         errorToast(error.response.data);
  //     } finally {
  //         await aniosQuery.refetch();
  //     }
  // }, [aniosQuery]);

  const handleClickUpdate = (id: number) => {
    setIdForUpdate(id);
    setIsUpdateDialogOpen(true);
  };

  const handleCLickDelete = (id: number) => {
    setIdForDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = async (page: number) => {
    await setPage(page);
    await factoremisionSEINQuery.refetch();
  };

  if (factoremisionSEINQuery.isLoading || aniosQuery.isLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="w-full max-w-[1150px] h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="font-Manrope">
          <h1 className="text-base text-foreground font-bold">
            {" "}
            Factor Emision SEIN{" "}
          </h1>
          <h2 className="text-xs sm:text-sm text-muted-foreground">
            {" "}
            Huella de carbono{" "}
          </h2>
        </div>
        <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
            <SelectFilter
              list={aniosQuery.data!}
              itemSelected={selectAnio}
              handleItemSelect={handleAnio}
              value={"id"}
              nombre={"nombre"}
              id={"id"}
              all={true}
              icon={<Flame className="h-3 w-3" />}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Registrar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-2">
                <DialogHeader>
                  <DialogTitle>Factor Emision SEIN</DialogTitle>
                  <DialogDescription>
                    Agregar un nuevo Factor Emision SEIN
                  </DialogDescription>
                  <DialogClose />
                </DialogHeader>
                {/* <FromTipoCombustible onClose={handleClose}/> */}
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
                FE CO2
                <p className="text-xs font-extrabold">[tCO2/MWh]</p>
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                FE CH4
                <p className="text-xs font-extrabold">[tCH4/MWh]</p>
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                FE N2O
                <p className="text-xs font-extrabold">[tN2o/MWh]</p>
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
            {factoremisionSEINQuery.data!.data.map(
              (item: FactorEmisionSEINCollection, index: number) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default"> {item.factorCO2}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default"> {item.factorCH4}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default"> {item.factorN2O}</Badge>
                  </TableCell>

                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary"> {item.anio}</Badge>
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
        {factoremisionSEINQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={factoremisionSEINQuery.data!.meta}
            onPageChange={handlePageChange}
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

          <UpdateFormTipoCombustible
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
            {/* <AlertDialogAction
                            className={buttonVariants({variant: "destructive"})}
                            onClick={handleDelete}
                        >
                            Eliminar
                        </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
