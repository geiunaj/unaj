"use client";
import { useEffect, useState, useCallback } from "react";
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
import { FormCombustion } from "./FormCombustion";
import { X } from "lucide-react";
import { ChevronsUpDown, Plus, Pencil } from "lucide-react";
import { useCombustionStore } from "../lib/combustion.store";
import {
  CombustionCollection,
  CombustionProps,
} from "../services/combustion.interface";
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
import { useAnioStore } from "@/components/anio/lib/anio.store";
import { UpdateFormCombustion } from "./UpdateFormCombustion";

export default function CombustionPage({ combustionType }: CombustionProps) {
  const { tipo } = combustionType;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { combustion, loadCombustion } = useCombustionStore();
  const { sedes, loadSedes } = useSedeStore();
  const { anios, loadAnios } = useAnioStore();
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [selectedAnio, setSelectedAnio] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [consumoDirection, setConsumoDirection] = useState<"asc" | "desc">(
    "desc"
  );
  const [idForUpdate, setIdForUpdate] = useState<number>(0);

  const handleClickUpdate = (id: number) => {
    setIdForUpdate(id);
    setIsUpdateDialogOpen(true);
  };

  useEffect(() => {
    if (sedes.length === 0) loadSedes();
    if (anios.length === 0) loadAnios();
  }, [loadSedes, loadAnios, sedes.length, anios.length]);

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();

    if (anios.length > 0 && !selectedAnio) {
      const currentAnio = anios.find((anio) => anio.nombre === currentYear);
      if (currentAnio) {
        setSelectedAnio(currentAnio.id.toString());
      }
    }
    loadCombustion({
      tipo,
      sedeId: Number(selectedSede),
      anioId: selectedAnio ? Number(selectedAnio) : undefined,
    });
  }, [loadCombustion, anios, tipo, selectedSede, selectedAnio]);

  const handleSedeChange = useCallback((value: string) => {
    setSelectedSede(value);
  }, []);

  const handleAnioChange = useCallback((value: string) => {
    setSelectedAnio(value);
  }, []);

  const handleToggleConsumoSort = useCallback(() => {
    setConsumoDirection((prevDirection) => {
      const newDirection = prevDirection === "asc" ? "desc" : "asc";
      loadCombustion({
        tipo,
        sedeId: Number(selectedSede),
        sort: "consumo",
        direction: newDirection,
      });
      return newDirection;
    });
  }, [loadCombustion, tipo, selectedSede]);

  const handleClose = useCallback(() => {
    setIsUpdateDialogOpen(false);
    loadCombustion({
      tipo,
      sedeId: Number(selectedSede),
      anioId: Number(selectedAnio),
    });
  }, [loadCombustion, tipo, selectedSede, selectedAnio]);

  if (!combustion) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full">
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">
            {tipo === "estacionario"
              ? "Combustión Estacionaria"
              : "Combustión Móvil"}
          </h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
            <Select
              onValueChange={handleSedeChange}
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

            <Select
              onValueChange={handleAnioChange}
              defaultValue={selectedAnio}
            >
              <SelectTrigger className="rounded-sm h-10 w-28 focus:outline-none focus-visible:ring-0">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent className="border-none">
                <SelectGroup>
                  {anios.map((anio) => (
                    <SelectItem key={anio.id} value={anio.nombre.toString()}>
                      {anio.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus /> Registrar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {tipo === "estacionario"
                    ? "Registro Estacionario"
                    : "Registro Móvil"}
                </DialogTitle>
                <DialogDescription>
                  Indicar el consumo de combustible de{" "}
                  {tipo === "estacionario"
                    ? "equipos estacionarios"
                    : "equipos móviles"}
                  .
                </DialogDescription>
              </DialogHeader>
              <FormCombustion onClose={handleClose} tipo={tipo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE EQUIPO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE GAS
              </TableHead>
              <TableHead className="text-center">
                <Button
                  className="font-Manrope text-sm font-bold text-center"
                  variant="ghost"
                  onClick={handleToggleConsumoSort}
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
              {/*<TableHead className="font-Manrope text-sm font-bold text-center">AÑO</TableHead>*/}
              <TableHead className="font-Manrope text-sm font-bold text-center">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combustion.map((item: CombustionCollection) => (
              <TableRow key={item.id} className="text-center">
                <TableCell>{item.tipoEquipo}</TableCell>
                <TableCell>{item.tipoCombustible}</TableCell>
                <TableCell>
                  <Badge variant="default">{item.consumo}</Badge>
                </TableCell>
                <TableCell>{item.unidad}</TableCell>
                <TableCell>{item.mes}</TableCell>

                {/* UPDATE */}
                <TableCell>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleClickUpdate(item.id)}
                  >
                    <Pencil1Icon className="h-4 text-blue-700" />
                  </Button>
                </TableCell>

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

      {/*MODAL UPDATE*/}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {tipo === "estacionario"
                ? "Registro Estacionario"
                : "Registro Móvil"}
            </DialogTitle>
            <DialogDescription>
              Indicar el consumo de combustible de{" "}
              {tipo === "estacionario"
                ? "equipos estacionarios"
                : "equipos móviles"}
              .
            </DialogDescription>
          </DialogHeader>
          <UpdateFormCombustion
            onClose={handleClose}
            tipo={tipo}
            id={idForUpdate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const CombustionEstacionariaPage = () => (
  <CombustionPage combustionType={{ tipo: "estacionario" }} />
);
export const CombustionMovilPage = () => (
  <CombustionPage combustionType={{ tipo: "movil" }} />
);
