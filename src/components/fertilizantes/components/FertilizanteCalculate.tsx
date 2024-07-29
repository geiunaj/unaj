"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calculator } from "lucide-react";
import { useSedeStore } from "@/components/sede/lib/sede.store";
import { useAnioStore } from "@/components/anio/lib/anio.store";
import SelectFilter from "@/components/selectFilter";
import { Badge } from "@/components/ui/badge";
import { useFertilizanteCalculateStore } from "../lib/fertilizanteCalculate.store";
import { FertilizanteCalcResponse } from "../services/fertilizanteCalculate.interface";
import ButtonCalculate from "@/components/buttonCalculate";
import ButtonBack from "@/components/ButtonBack";
import { useRouter } from "next/navigation";

export default function FertilizanteCalculate() {
  const { push } = useRouter();

  // STORES
  const {
    FertilizanteCalculates,
    loadFertilizanteCalculates,
    createFertilizanteCalculate,
  } = useFertilizanteCalculateStore();
  const { sedes, loadSedes } = useSedeStore();
  const { anios, loadAnios } = useAnioStore();

  // SELECTS - FILTERS
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [selectedAnio, setSelectedAnio] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedTipo, setSelectedTipo] = useState<string>("estacionaria");

  useEffect(() => {
    if (sedes.length === 0) loadSedes();
    if (anios.length === 0) loadAnios();
    if (FertilizanteCalculates.length === 0)
      loadFertilizanteCalculates(
        parseInt(selectedSede),
        parseInt(selectedAnio)
      );
  }, [
    loadFertilizanteCalculates,
    loadSedes,
    loadAnios,
    sedes.length,
    anios.length,
    selectedSede,
    selectedAnio,
    FertilizanteCalculates.length,
  ]);

  const handleSedeChange = useCallback(
    (value: string) => {
      setSelectedSede(value);
      loadFertilizanteCalculates(parseInt(value), parseInt(selectedAnio));
    },
    [loadFertilizanteCalculates, selectedAnio, selectedTipo]
  );

  const handleAnioChange = useCallback(
    (value: string) => {
      setSelectedAnio(value);
      loadFertilizanteCalculates(parseInt(selectedSede), parseInt(value));
    },
    [loadFertilizanteCalculates, selectedSede, selectedTipo]
  );

  const handleCalculate = useCallback(async () => {
    await createFertilizanteCalculate(
      parseInt(selectedSede),
      parseInt(selectedAnio)
    );
    await loadFertilizanteCalculates(
      parseInt(selectedSede),
      parseInt(selectedAnio)
    );
  }, [
    createFertilizanteCalculate,
    selectedSede,
    selectedAnio,
    selectedTipo,
    loadFertilizanteCalculates,
  ]);

  const handleFertilizante = () => {
    push("/fertilizante");
  };

  const tipos = [
    { value: "estacionaria", name: "Estacionaria" },
    { value: "movil", name: "Móvil" },
  ];

  // const handleTipo = useCallback((value: string) => {
  //     setSelectedTipo(value);
  //     loadFertilizanteCalculates(parseInt(selectedSede), parseInt(selectedAnio));
  // }, [loadFertilizanteCalculates, selectedAnio, selectedSede]);

  if (!FertilizanteCalculates) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <ButtonBack onClick={handleFertilizante} />
          <div className="font-Manrope">
            <h1 className="text-base text-gray-800 font-bold">
              Cálculo de emisiones por fertilizantes
            </h1>
            <h2 className="text-sm text-gray-500">Huella de carbono</h2>
          </div>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 font-normal justify-end items-center">
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
          <ButtonCalculate
            onClick={handleCalculate}
            variant="default"
            text="Calcular"
          />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TIPO DE COMBUSTIBLE
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                CONSUMO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                UNIDAD
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                PORCENTAJE NITROGENO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                CANTIDAD DE APORTE DE NITROGENO
              </TableHead>
              {/* <TableHead className="font-Manrope text-sm font-bold text-center">
                FACTOR DE EMISIÓN PARA EMISIONES DIRECTAS
              </TableHead> */}
              {/* <TableHead className="font-Manrope text-sm font-bold text-center">
                EMISIONES DIRECTA DE LOS SUELOS
              </TableHead> */}
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TOTAL DE EMISIONES DIRECTAS DE N2O
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                EMISIONES GEI
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FertilizanteCalculates.map(
              (FertilizanteCalculate: FertilizanteCalcResponse) => (
                <TableRow
                  className="text-center"
                  key={FertilizanteCalculate.id}
                >
                  <TableCell className="text-start">
                    {FertilizanteCalculate.tipoFertilizante}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {FertilizanteCalculate.consumo}
                    </Badge>
                  </TableCell>
                  <TableCell>{FertilizanteCalculate.unidad}</TableCell>
                  <TableCell>
                    {FertilizanteCalculate.porcentajeNitrogeno}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {FertilizanteCalculate.cantidadAporte}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>{FertilizanteCalculate.emisionDirecta}</TableCell> */}
                  <TableCell>
                    {FertilizanteCalculate.totalEmisionesDirectas}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {FertilizanteCalculate.emisionGEI}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
