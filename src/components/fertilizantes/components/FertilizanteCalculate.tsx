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
import { parse } from "path";

export default function FertilizanteCalculate() {
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
  const [fertilizanteId, setFertilizanteId] = useState<string>("1");
  const [cantidad, setCantidad] = useState<number>(0);
  const [factorEmisionId, setFactorEmisionId] = useState<string>("1");

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
    [loadFertilizanteCalculates, selectedAnio]
  );

  const handleAnioChange = useCallback(
    (value: string) => {
      setSelectedAnio(value);
      loadFertilizanteCalculates(parseInt(selectedSede), parseInt(value));
    },
    [loadFertilizanteCalculates, selectedSede]
  );

  const handleCalculate = useCallback(async () => {
    await createFertilizanteCalculate(
      parseInt(selectedSede),
      parseInt(selectedAnio),
      parseInt(fertilizanteId),
      cantidad,
      parseInt(factorEmisionId)
    );
    await loadFertilizanteCalculates(
      parseInt(selectedSede),
      parseInt(selectedAnio)
    );
  }, [
    createFertilizanteCalculate,
    selectedSede,
    selectedAnio,
    loadFertilizanteCalculates,
  ]);

  const tipos = [
    { value: "estacionaria", name: "Estacionaria" },
    { value: "movil", name: "Móvil" },
  ];

  // const handleTipo = useCallback((value: string) => {
  //     setSelectedTipo(value);
  //     loadFertilizanteCalculates(parseInt(selectedSede), parseInt(selectedAnio), value);
  // }, [loadFertilizanteCalculates, selectedAnio, selectedSede]);

  if (!FertilizanteCalculates) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full">
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="font-Manrope">
          <h1 className="text-xl text-gray-800 font-bold">
            Cálculo de emisiones de N2O por fertilizante
          </h1>
          <h2 className="text-base text-gray-500">Huella de carbono</h2>
        </div>
        <div className="flex justify-end gap-5">
          <div className="flex flex-row space-x-4 mb-6 font-normal justify-end items-end">
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
                TIPO DE FERTILIZANTE
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                UNIDAD
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                CANTIDAD
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                % NITROGENO
              </TableHead>
              {/*<TableHead className="font-Manrope text-sm font-bold text-center">*/}
              {/*    VALOR CALORICO NETO*/}
              {/*</TableHead>*/}
              <TableHead className="font-Manrope text-sm font-bold text-center">
                CANTIDA DE APORTE DE NITROGENO
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                FACTOR DE EMISION DIRECTA
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                EMISIONES DIRECTAS DE LOS SUELOS
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                TOTAL DE EMICIONES DIRECTAS DE N2O
              </TableHead>
              <TableHead className="font-Manrope text-sm font-bold text-center">
                EMISIONES GEI
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FertilizanteCalculates.map(
              (fertilizanteCalculate: FertilizanteCalcResponse) => (
                <TableRow
                  className="text-center"
                  key={fertilizanteCalculate.id}
                >
                  <TableCell className="text-start">
                    {fertilizanteCalculate.tipofertilizante}
                  </TableCell>
                  <TableCell className="text-start">
                    {fertilizanteCalculate.unidad}
                  </TableCell>
                  <TableCell>{fertilizanteCalculate.cantidad}</TableCell>
                  <TableCell>
                    {fertilizanteCalculate.porcentajeNitrogeno}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {fertilizanteCalculate.cantidadAporte}
                    </Badge>
                  </TableCell>
                  <TableCell>{fertilizanteCalculate.factorEmision}</TableCell>
                  <TableCell>{fertilizanteCalculate.emisionDirecta}</TableCell>
                  <TableCell>
                    {fertilizanteCalculate.totalEmisionesDirectas}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {fertilizanteCalculate.emisionGEI}
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
