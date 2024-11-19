"use client";

import React, { useCallback, useState } from "react";
import { Pen, Plus, Trash2, Bean } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import ButtonBack from "@/components/ButtonBack";
import {
  deleteGrupoConsumible,
  getGrupoConsumiblePaginate,
} from "../../services/grupoActivo.actions";
import { CreateFormGrupoConsumible } from "./CreateFormGrupoActivo";
import { GrupoConsumibleCollection } from "../../services/grupoActivo.interface";
import { UpdateFormGrupoConsumible } from "./UpdateFormGrupoActivo";

export default function GrupoConsumiblePage() {
  const { push } = useRouter();

  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //IDS
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  const [page, setPage] = useState(1);

  const COLUMS = ["N°", "NOMBRE", "ACCIONES"];

  //USE QUERIES
  const grupoConsumibleQuery = useQuery({
    queryKey: ["grupoConsumible", page],
    queryFn: () => getGrupoConsumiblePaginate(page),
    refetchOnWindowFocus: false,
  });

  // HANDLES
  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    grupoConsumibleQuery.refetch();
  }, [grupoConsumibleQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    grupoConsumibleQuery.refetch();
  }, [grupoConsumibleQuery]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteGrupoConsumible(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(
        error.response?.data?.message ||
          "Error al eliminar el grupo de consumible"
      );
    } finally {
      await grupoConsumibleQuery.refetch();
    }
  }, [grupoConsumibleQuery]);
  const handleClickUpdate = (id: number) => {
    setIdForUpdate(id);
    setIsUpdateDialogOpen(true);
  };

  const handleCLickDelete = (id: number) => {
    setIdForDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChage = async (page: number) => {
    await setPage(page);
    await grupoConsumibleQuery.refetch();
  };

  const handleTipoConsumible = () => {
    push("/tipo-consumible");
  };

  if (grupoConsumibleQuery.isLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="w-full max-w-screen-xl h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex gap-4 items-center">
          <ButtonBack onClick={handleTipoConsumible} />
          <div className="font-Manrope">
            <h1 className="text-base text-foreground font-bold">
              Grupo de Consumible{" "}
            </h1>
            <h2 className="text-xs sm:text-sm text-muted-foreground">
              Huella de carbono
            </h2>
          </div>
        </div>
        <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Registrar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-2">
                <DialogHeader>
                  <DialogTitle>GRUPO DE CONSUMIBLE</DialogTitle>
                  <DialogDescription>
                    Agregar Grupo de Consumible
                  </DialogDescription>
                  <DialogClose />
                </DialogHeader>
                <CreateFormGrupoConsumible onClose={handleClose} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMS.map((item) => (
                <TableHead
                  key={item}
                  className="text-xs sm:text-sm font-bold text-center"
                >
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {grupoConsumibleQuery.data!.data.map(
              (item: GrupoConsumibleCollection) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{item.rn}</Badge>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.nombre}
                  </TableCell>

                  <TableCell className="text-xs whitespace-nowrap overflow-hidden text-ellipsis p-1">
                    <div className="flex justify-center gap-4">
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
        {grupoConsumibleQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={grupoConsumibleQuery.data!.meta}
            onPageChange={handlePageChage}
          />
        )}
      </div>

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ACTUALIZAR GRUPO DE CONSUMIBLE</DialogTitle>
            <DialogDescription>
              Actualizar Grupo de Consumible
            </DialogDescription>
          </DialogHeader>
          <UpdateFormGrupoConsumible
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
