"use client";

import { useCallback, useState } from "react";
import SelectFilter from "@/components/SelectFilter";
import { Pen, Plus, Trash2, Calendar, Bean, Link2 } from "lucide-react";
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
import { useFertilizanteFactor } from "../lib/tipoFertilizanteFactor.hook";
import { deleteTipoFertilizanteFactor } from "../services/tipoFertilizanteFactor.actions";
import { errorToast, successToast } from "@/lib/utils/core.function";
import { useAnio } from "@/components/combustion/lib/combustion.hook";
import { FertilizanteFactorCollection } from "../services/tipoFertilizanteFactor.interface";
import { ChangeTitle } from "@/components/TitleUpdater";
import { CreateFormTipoFertilizanteFactor } from "./CreateFormTipoFertilizanteFactor";
import { UpdateFormTipoFertilizanteFactor } from "./UpdateFormTipoFertilizanteFactor";
import { useQuery } from "@tanstack/react-query";
import { getTiposFertilizante } from "../services/tipoFertilizante.actions";
import CustomPagination from "@/components/Pagination";
import Link from "next/link";

export default function FertilizanteFactorPage() {
  ChangeTitle("Factor de Emisión de Fertilizante");

  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectAnio, setSelectAnio] = useState<string>("");
  const [selectTipoFertilizante, setSelectTipoFertilizante] =
    useState<string>("");
  const [page, setPage] = useState<number>(1);

  const anioQuery = useAnio();

  const tipoFertilizanteQuery = useQuery({
    queryKey: ["tipoFertilizanteQ"],
    queryFn: () => getTiposFertilizante(),
    refetchOnWindowFocus: false,
  });

  //IDS
  const [idForUpdate, setIdForUpdate] = useState<number>(0);
  const [idForDelete, setIdForDelete] = useState<number>(0);

  const factorEmisionQuery = useFertilizanteFactor({
    tipoFertilizanteId: selectTipoFertilizante,
    anioId: selectAnio,
    page,
    perPage: 10,
  });

  const handleAnioChange = useCallback(
    async (value: string) => {
      await setSelectAnio(value);
      await factorEmisionQuery.refetch();
    },
    [factorEmisionQuery]
  );

  const handleTipoFertilizanteChange = useCallback(
    async (value: string) => {
      await setSelectTipoFertilizante(value);
      await factorEmisionQuery.refetch();
    },
    [factorEmisionQuery]
  );

  // HANDLES

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    factorEmisionQuery.refetch();
  }, [factorEmisionQuery]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    factorEmisionQuery.refetch();
  }, [factorEmisionQuery]);

  const handleDelete = useCallback(async () => {
    try {
      const response = await deleteTipoFertilizanteFactor(idForDelete);
      setIsDeleteDialogOpen(false);
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(
        error.response?.data?.message ||
          "Error al eliminar el factor de emisión de fertilizante"
      );
    }
    await factorEmisionQuery.refetch();
  }, [factorEmisionQuery]);

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
    await factorEmisionQuery.refetch();
  };

  if (
    anioQuery.isLoading ||
    factorEmisionQuery.isLoading ||
    tipoFertilizanteQuery.isLoading
  ) {
    return <SkeletonTable />;
  }

  return (
    <div className="w-full max-w-screen-xl h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center mb-6">
        <div className="flex flex-row sm:justify-start sm:items-center gap-5 justify-center">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">
            <SelectFilter
              list={tipoFertilizanteQuery.data!}
              itemSelected={selectTipoFertilizante}
              handleItemSelect={handleTipoFertilizanteChange}
              value={"id"}
              nombre={"nombre"}
              id={"id"}
              icon={<Bean className="h-3 w-3" />}
              all={true}
            />
            <SelectFilter
              list={anioQuery.data!}
              itemSelected={selectAnio}
              handleItemSelect={handleAnioChange}
              value={"nombre"}
              nombre={"nombre"}
              id={"nombre"}
              icon={<Calendar className="h-3 w-3" />}
              all={true}
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
                  <DialogTitle>
                    {" "}
                    Factor de Emision Directa Fertilizante
                  </DialogTitle>
                  <DialogDescription>
                    Agregar Tipo de Fertilizante
                  </DialogDescription>
                  <DialogClose />
                </DialogHeader>
                <CreateFormTipoFertilizanteFactor onClose={handleClose} />
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
                CLASE
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                FERTILIZANTE
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                FACTOR
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
            {factorEmisionQuery.data!.data.map(
              (item: FertilizanteFactorCollection, index: number) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="outline">{item.clase}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-start">
                    <Badge variant="secondary">{item.tipoFertilizante}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default">{item.valor}</Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {item.anio}
                  </TableCell>

                  <TableCell className="text-xs sm:text-sm p-1">
                    <div className="flex justify-center gap-4">
                      {item.link && (
                        <Link href={item.link} target="_blank">
                          <Button
                            className="h-7 flex items-center gap-2"
                            size="sm"
                            variant="secondary"
                          >
                            <Link2 className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
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

        {factorEmisionQuery.data!.meta.totalPages > 1 && (
          <CustomPagination
            meta={factorEmisionQuery.data!.meta}
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
          <UpdateFormTipoFertilizanteFactor
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
