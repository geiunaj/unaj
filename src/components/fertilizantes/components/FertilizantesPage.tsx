import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { FormFertilizantes } from "./FormFertilizantes";
import { useSedeStore } from "@/components/sede/lib/sede.store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFertilizanteStore } from "../lib/fertilizante.store";
import { Badge } from "@/components/ui/badge";
import { fertilizanteCollection } from "../services/fertilizante.interface";
import { useAnioStore } from "@/components/anio/lib/anio.store";
import SelectFilter from "@/components/selectFilter";
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
import { useClaseFertilizante } from "@/components/tipoFertilizante/lib/claseFertilizante.store";

//types claseFertilzante 

export default function FertilizantePage() {
  //DIALOGS
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  //STORES
  const { fertilizante, loadFertilizante, deleteFertilizante } =
    useFertilizanteStore();
  const {claseFertilizante, loadClaseFertilizante} = useClaseFertilizante();
  const { sedes, loadSedes } = useSedeStore();
  const { anios, loadAnios } = useAnioStore();

  //SELECTS - FILTERS
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [selectedAnio, setSelectedAnio] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedClaseFertilizante, setSelectedClaseFertilizante] =
    useState<string>("Sintético");
  const [cantidadDirection, setCantidadDirection] = useState<"asc" | "desc">(
    "desc"
  );

  //IDS
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

  useEffect(() => {
    if(fertilizante.length === 0) loadFertilizante();
    if (claseFertilizante.length === 0) loadClaseFertilizante();
    if (sedes.length === 0) loadSedes();
    if (anios.length === 0) loadAnios();
  }, [loadFertilizante,loadClaseFertilizante, loadSedes, selectedSede]);

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();

    if (anios.length > 0 && !selectedAnio) {
      const currentAnio = anios.find((anio) => anio.nombre === currentYear);
      if (currentAnio) {
        setSelectedAnio(currentAnio.id.toString());
      }
    }
    loadFertilizante({
      sedeId: Number(selectedSede),
      anioId: selectedAnio ? Number(selectedAnio) : undefined,
      claseFertilizante: selectedClaseFertilizante
        ? selectedClaseFertilizante
        : undefined,
    });
  }, [anios, selectedSede, selectedAnio, selectedClaseFertilizante]);

  const handleclaseFertilizanteChange = useCallback((value: string) => {
    setSelectedClaseFertilizante(value);
  }, []);

  const handleSedeChange = useCallback((value: string) => {
    setSelectedSede(value);
  }, []);

  const handleAnioChange = useCallback((value: string) => {
    setSelectedAnio(value);
  }, []);

  const handleToggleCantidadSort = () => {
    setCantidadDirection(cantidadDirection === "asc" ? "desc" : "asc");
    loadFertilizante({
      sedeId: Number(selectedSede),
      sort: "cantidadFertilizante",
      direction: cantidadDirection === "asc" ? "desc" : "asc",
    });
  };

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    loadFertilizante({
      sedeId: Number(selectedSede),
      anioId: Number(selectedAnio),
      claseFertilizante: selectedClaseFertilizante,
    });
  }, [loadFertilizante, selectedSede, selectedAnio, selectedClaseFertilizante]);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateDialogOpen(false);
    loadFertilizante({
      sedeId: Number(selectedSede),
      anioId: Number(selectedAnio),
      claseFertilizante: selectedClaseFertilizante,
    });
  }, [loadFertilizante, selectedSede, selectedAnio, selectedClaseFertilizante]);

  const handleDelete = useCallback(async () => {
    await deleteFertilizante(idForDelete);
    setIsDeleteDialogOpen(false);
    loadFertilizante({
      sedeId: Number(selectedSede),
      anioId: Number(selectedAnio),
      claseFertilizante: selectedClaseFertilizante,
    });
  }, [
    deleteFertilizante,
    idForDelete,
    loadFertilizante,
    selectedSede,
    selectedAnio,
    selectedClaseFertilizante,
  ]);

  if (!fertilizante) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full ">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">FERTILIZANTES</h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
            <SelectFilter
              list={claseFertilizante}
              itemSelected={selectedClaseFertilizante}
              handleItemSelect={handleclaseFertilizanteChange}
              value={"nombre"}
              nombre={"nombre"}
              id={"nombre"}
            />

            <SelectFilter
              list={sedes}
              itemSelected={selectedSede}
              handleItemSelect={handleSedeChange}
              value={"id"}
              nombre={"name"}
              id={"id"}
            />

            <SelectFilter
              list={anios}
              itemSelected={selectedAnio}
              handleItemSelect={handleAnioChange}
              value={"nombre"}
              nombre={"nombre"}
              id={"id"}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className=" text-white">
                <Plus />
                Registrar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-2">
              <DialogHeader className="">
                <DialogTitle>Fertilizante</DialogTitle>
                <DialogDescription>
                  Indicar el consumo de fertilizantes por tipo y considerar
                  aquellos usados en prácticas agronómicas y/o mantenimiento de
                  áreas verdes.
                </DialogDescription>
                <DialogClose></DialogClose>
              </DialogHeader>
              <FormFertilizantes onClose={handleClose} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-bold text-center">
                TIPO DE FERTILIZANTE
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                FERTILIZANTE
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                <Button variant="ghost" onClick={handleToggleCantidadSort}>
                  CNT. DE FERTILIZANTE
                  <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                % DE NITROGENO
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                FICHA TECNICA
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                AÑO
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fertilizante.map((item: fertilizanteCollection) => (
              <TableRow key={item.id} className="text-center">
                <TableCell>{item.clase}</TableCell>
                <TableCell>{item.tipoFertilizante}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.porcentajeNit} %</TableCell>
                <TableCell>
                  {item.is_ficha ? <Badge>SI</Badge> : <Badge>NO</Badge>}
                </TableCell>
                <TableCell>{item.anio}</TableCell>
                <TableCell className="p-1">
                  <div className="flex justify-center gap-4">
                    {/*UPDATE*/}
                    <Button
                      className="h-7 w-7"
                      size="icon"
                      variant="outline"
                      onClick={() => handleClickUpdate(item.id)}
                    >
                      <Pencil1Icon className="h-4 text-blue-700" />
                    </Button>

                    {/*DELETE*/}
                    <Button
                      className="h-7 w-7"
                      size="icon"
                      variant="outline"
                      onClick={() => handleCLickDelete(item.id)}
                    >
                      <Trash2 className="h-4 text-gray-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Registro de Fertilizante</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* <UpdateFormCombustion
                        onClose={handleCloseUpdate}
                        tipo={tipo}
                        id={idForUpdate}
                    /> */}
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
