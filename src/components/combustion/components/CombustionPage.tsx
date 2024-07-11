"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { FormCombustion } from "./FormCombustion";
import { X } from "lucide-react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useCombustionStore } from "../lib/combustion.store";
import { CombustionCollection } from "../services/combustion.interface";
import { useSedeStore } from "@/components/sede/lib/sede.store";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CombustionPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { combustion, loadCombustion } = useCombustionStore();
  const { sedes, loadSedes } = useSedeStore();
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
    "desc"
  );

  const formulario = "estacionario";

  useEffect(() => {
    loadCombustion({ tipo: formulario, sedeId: Number(selectedSede) }); // Llama a loadCombustion cuando el componente se monta
    loadSedes();
  }, [loadCombustion, loadSedes]); // Dependencia vacía para solo llamar una vez al montar

  const handleSedeChange = (value: string) => {
    setSelectedSede(value);
    loadCombustion({ tipo: formulario, sedeId: Number(value) });
  };

  const handleToggleConsumoSort = () => {
    setConsumoDirection(consumoDirection === "asc" ? "desc" : "asc");
    loadCombustion({
      tipo: formulario,
      sedeId: Number(selectedSede),
      sort: "consumo",
      direction: consumoDirection,
    });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    loadCombustion({ tipo: formulario, sedeId: Number(selectedSede) });
  };

  if (!combustion) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full ">
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">
            COMBUSTION ESTACIONARIA
          </h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
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
            <DialogContent className="max-w-lg border-2">
              <DialogHeader className="">
                <DialogTitle>Combustión Estacionaria</DialogTitle>
                <DialogDescription>
                  Indicar el consumo de combustible de equipos estacionarios,
                  incluir balones usados en calefacción
                </DialogDescription>
                <DialogClose></DialogClose>
              </DialogHeader>
              <FormCombustion onClose={handleClose} />
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
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE EQUIPO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE GAS
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleToggleConsumoSort()}
                >
                  CONSUMO
                  <ChevronsUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                UNIDAD
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                MES
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                AÑO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combustion.map((item: CombustionCollection) => (
              <TableRow key={item.id} className="text-center">
                {/* <TableCell>{item.sede}</TableCell> */}
                <TableCell>{item.tipoEquipo}</TableCell>
                <TableCell>{item.tipoCombustible}</TableCell>
                <TableCell>
                  <Badge variant="default">{item.consumo}</Badge>
                </TableCell>
                <TableCell>{item.unidad}</TableCell>
                <TableCell>{item.mes}</TableCell>
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
        </Table>
      </div>
    </div>
  );
}
