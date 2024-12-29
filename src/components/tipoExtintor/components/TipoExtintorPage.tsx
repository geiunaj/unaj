"use client";
import React, { useCallback, useState } from "react";
import { Pen, Plus, Trash2, Bolt, Link2 } from "lucide-react";
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
import { CreateFormTipoExtintor } from "./CreateFormTipoExtintor";
import { errorToast, successToast } from "@/lib/utils/core.function";
import { UpdateFormTipoExtintor } from "@/components/tipoExtintor/components/UpdateFormTipoExtintor";
import { deleteTipoExtintor } from "@/components/tipoExtintor/services/tipoExtintor.actions";
import { TipoExtintorCollectionItem } from "@/components/tipoExtintor/services/tipoExtintor.interface";
import { useTipoExtintor } from "@/components/tipoExtintor/lib/tipoExtintor.hook";
import CustomPagination from "@/components/Pagination";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ChangeTitle } from "@/components/TitleUpdater";

export default function TipoExtintorPage() {
  ChangeTitle("Tipos de Extintores");
  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //IDS
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  const [name, setName] = useState("");
  const [page, setPage] = useState(1);

  //USE QUERIES
  const tipoExtintorQuery = useTipoExtintor(name, page);

  // HANDLES
  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      setPage(1);
      tipoExtintorQuery.refetch();
    },
    [tipoExtintorQuery]
  );

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    tipoExtintorQuery.refetch();
  }, [tipoExtintorQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    tipoExtintorQuery.refetch();
  }, [tipoExtintorQuery]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteTipoExtintor(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(
        error.response?.data?.message || "Error al eliminar el tipo de extintor"
      );
    } finally {
      await tipoExtintorQuery.refetch();
    }
  }, [tipoExtintorQuery]);
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
    await tipoExtintorQuery.refetch();
  };

  if (tipoExtintorQuery.isLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="w-full max-w-screen-xl h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
        <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4 w-1/2">
            <Input
              className="w-44 h-7 text-xs"
              type="text"
              placeholder="Buscar"
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
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
                  <DialogTitle> TIPOS DE VEHICULOS</DialogTitle>
                  <DialogDescription>
                    Agregar Tipo de Extintor
                  </DialogDescription>
                  <DialogClose />
                </DialogHeader>
                <CreateFormTipoExtintor onClose={handleClose} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                N°
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                NOMBRE
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tipoExtintorQuery.data!.data.map(
              (item: TipoExtintorCollectionItem) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{item.rn}</Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-72 whitespace-nowrap overflow-hidden text-ellipsis">
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
        {tipoExtintorQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={tipoExtintorQuery.data!.meta}
            onPageChange={handlePageChage}
          />
        )}
      </div>

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Registro de Extintor</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <UpdateFormTipoExtintor
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
