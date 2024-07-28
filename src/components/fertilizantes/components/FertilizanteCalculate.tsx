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
import { CombustionCalcResponse } from "@/components/combustion/services/combustionCalculate.interface";
import { Badge } from "@/components/ui/badge";
import { useFertilizanteCalculateStore } from "../lib/fertilizanteCalculate.store";
import { FertilizanteCalcResponse } from "../services/fertilizanteCalculate.interface";

export default function CombustionCalculate() {
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
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">
            Cálculo de emisiones de CO2 por combustión
          </h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
            {/* <SelectFilter
                            list={tipos}
                            itemSelected={selectedTipo}
                            handleItemSelect={handleTipo}
                            value={"value"}
                            nombre={"name"}
                            id={"value"}
                        /> */}

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
          <Button
            variant="default"
            className="flex justify-between gap-2"
            onClick={handleCalculate}
          >
            <Calculator className="h-4" /> Calcular
          </Button>
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
                UNIDAD
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                CONSUMO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                PORCENTAJE NITROGENO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                CANTIDAD DE APORTE DE NITROGENO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                FACTOR DE EMISIÓN PARA EMISIONES DIRECTAS
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                EMISIONES DIRECTA DE LOS SUELOS
              </TableHead>
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
                    {FertilizanteCalculate.tipofertilizanteId}
                  </TableCell>
                  <TableCell className="text-start">
                    {FertilizanteCalculate.unidad}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {FertilizanteCalculate.consumoTotal}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-start">
                    {FertilizanteCalculate.porcentajeNitrogeno}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {FertilizanteCalculate.cantidadAporte}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-start">
                    {FertilizanteCalculate.emisionDirecta}
                  </TableCell>
                  <TableCell className="text-start">
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
