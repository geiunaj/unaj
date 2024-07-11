"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { SelectItem } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
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

export default function FertilizantePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sedes, loadSedes } = useSedeStore();
  const { fertilizante, loadFertilizante } = useFertilizanteStore();
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [cantidadDirection, setCantidadDirection] = useState<"asc" | "desc">(
    "desc"
  );


  useEffect(() => {
    loadFertilizante({ sedeId: Number(selectedSede) });
    loadSedes();
  }, [loadFertilizante, loadSedes]);

  const handleSedeChange = (value: string) => {
    setSelectedSede(value);
    loadFertilizante({ sedeId: Number(value) });
  };

  const handleToggleCantidadSort = () => {
    setCantidadDirection(cantidadDirection === "asc" ? "desc" : "asc");
    // loadCombustion({
    //   tipo: formulario,
    //   sedeId: Number(selectedSede),
    //   sort: "consumo",
    //   direction: consumoDirection,
    // });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    loadFertilizante({ sedeId: Number(selectedSede) });
  
  };

  if (!fertilizante) return 
  <p>Cargando...</p>;

  return (
    <div className="w-full max-w-[1150px] h-full ">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">FERTILIZANTES</h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end0">
          <Select
              onValueChange={(value) => handleSedeChange(value)}
              defaultValue={selectedSede}
            >
              <SelectTrigger className="rounded-sm h-10 w-80 focus:outline-none focus-visible:ring-0">
                <SelectValue placeholder="Selecciona la Sede" />
              </SelectTrigger>
              <SelectContent className="border-none">
                <SelectGroup>
                  {sedes.map((sede) => (
                    <SelectItem key={sede.id} value={sede.id.toString()}>
                      {sede.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
              <FormFertilizantes onClose={handleClose}/>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className=" font-Manrope text-sm font-bold text-center">
                SEDE
              </TableHead> */}
              <TableHead className="text-sm font-bold text-center">
                TIPO DE FERTILIZANTE
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                FERTILIZANTE
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleToggleCantidadSort()}
                >
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
          {fertilizante.map((item:fertilizanteCollection ) => (
              <TableRow key={item.id} className="text-center">
                <TableCell>{item.clase}</TableCell>
                <TableCell>{item.tipoFertilizante}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.porcentajeNitrogeno}</TableCell>
                <TableCell>
                  {item.is_ficha ? (
                    <Badge>SI</Badge>
                  ) : (
                    <Badge>NO</Badge>
                  )}
                </TableCell>
                <TableCell>{item.anio}</TableCell>
                <TableCell className="flex space-x-4 justify-center items-center bg-transparent ">
                  <Button
                    size="icon"
                    className="bg-transparent hover:bg-transparent text-blue-700 border"
                  >
                    <Pencil1Icon className="h-4 text-blue-700" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>

          {/* <TableBody>
            <TableRow className="text-center">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="flex space-x-4 justify-center items-center bg-transparent ">
                <Button
                  size="icon"
                  className="bg-transparent hover:bg-transparent text-blue-700 border"
                >
                  <Pencil1Icon className="h-4 text-blue-700" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </div>
    </div>
  );
}
