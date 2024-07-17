"use client";
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
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormPapel } from "./FormPapelOficce";
import { useSedeStore } from "@/components/sede/lib/sede.store";
import { useConsumoPapelStore } from "../lib/consumoPapel.store";
import {
  CollectionConsumoPapel,
  CreateConsumoPapelProps,
} from "../services/consumoPapel.interface";

export default function PapelPage({ onClose }: CreateConsumoPapelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sedes, loadSedes } = useSedeStore();
  const { consumoPapel, loadConsumoPapel } = useConsumoPapelStore();
  const [selectedSede, setSelectedSede] = useState<string>("1");

  useEffect(() => {
    loadConsumoPapel({ sedeId: Number(selectedSede) });
    loadSedes();
  }, [loadConsumoPapel, loadSedes, selectedSede]);

  const handleSedeChange = (value: string) => {
    setSelectedSede(value);
    loadConsumoPapel({ sedeId: Number(value) });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    loadConsumoPapel({ sedeId: Number(selectedSede) });
  };

  if (!consumoPapel) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full ">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">CONSUMO DE PAPEL</h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end">
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
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="text-sm font-bold text-center ">
                SEDE
              </TableHead> */}
              <TableHead className="text-sm font-bold text-center">
                TIPO DE HOJA
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                COMPRAS ANUALES
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                UNIDAD
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                % CERTIFICADO O RECICLABLE
              </TableHead>
              <TableHead className="text-sm font-bold text-center">
                CERTIFICADO
              </TableHead>
              <TableHead className=" text-sm font-bold text-center">
                GRAMAJE
              </TableHead>
              <TableHead className=" text-sm font-bold text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consumoPapel.map((item: CollectionConsumoPapel) => (
              <TableRow key={item.id} className="text-center">
                {/* <TableCell>{item.sede}</TableCell> */}
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.cantidad_paquete}</TableCell>
                <TableCell>{item.unidad_paquete}</TableCell>
                <TableCell>
                  {item.porcentaje_reciclado === 0
                    ? "---"
                    : item.porcentaje_reciclado + "%"}
                </TableCell>
                <TableCell>
                  {item.nombre_certificado ? item.nombre_certificado : "---"}
                </TableCell>
                <TableCell>{item.gramaje} g</TableCell>
                <TableCell className="flex space-x-4 justify-center items-center bg-transparent">
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
