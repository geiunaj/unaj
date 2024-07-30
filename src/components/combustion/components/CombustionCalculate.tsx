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
import { useCombustionCalculateStore } from "@/components/combustion/lib/combustionCalculate.store";
import { CombustionCalcResponse } from "@/components/combustion/services/combustionCalculate.interface";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import ButtonCalculate from "@/components/buttonCalculate";
import ButtonBack from "@/components/ButtonBack";

interface CombustionCalculateProps {
  tipo: Tipo;
}

type Tipo = "estacionaria" | "movil";

export default function CombustionCalculate({
  tipo = "estacionaria",
}: CombustionCalculateProps) {
  const { push } = useRouter();

  // STORES
  const {
    combustionCalculates,
    loadCombustionCalculates,
    createCombustionCalculate,
  } = useCombustionCalculateStore();
  const { sedes, loadSedes } = useSedeStore();
  const { anios, loadAnios } = useAnioStore();

  // SELECTS - FILTERS
  const [selectedSede, setSelectedSede] = useState<string>("1");
  const [selectedAnio, setSelectedAnio] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedTipo, setSelectedTipo] = useState<string>(tipo);

  useEffect(() => {
    if (sedes.length === 0) loadSedes();
    if (anios.length === 0) loadAnios();
    if (combustionCalculates.length === 0)
      loadCombustionCalculates(
        parseInt(selectedSede),
        parseInt(selectedAnio),
        selectedTipo
      );
  }, [
    loadCombustionCalculates,
    loadSedes,
    loadAnios,
    sedes.length,
    anios.length,
    selectedSede,
    selectedAnio,
    combustionCalculates.length,
    selectedTipo,
  ]);

  const handleSedeChange = useCallback(
    (value: string) => {
      setSelectedSede(value);
      loadCombustionCalculates(
        parseInt(value),
        parseInt(selectedAnio),
        selectedTipo
      );
    },
    [loadCombustionCalculates, selectedAnio, selectedTipo]
  );

  const handleAnioChange = useCallback(
    (value: string) => {
      setSelectedAnio(value);
      loadCombustionCalculates(
        parseInt(selectedSede),
        parseInt(value),
        selectedTipo
      );
    },
    [loadCombustionCalculates, selectedSede, selectedTipo]
  );

  const handleCalculate = useCallback(async () => {
    await createCombustionCalculate(
      parseInt(selectedSede),
      parseInt(selectedAnio),
      selectedTipo
    );
    await loadCombustionCalculates(
      parseInt(selectedSede),
      parseInt(selectedAnio),
      selectedTipo
    );
  }, [
    createCombustionCalculate,
    selectedSede,
    selectedAnio,
    selectedTipo,
    loadCombustionCalculates,
  ]);

  const tipos = [
    { value: "estacionaria", name: "Estacionaria" },
    { value: "movil", name: "Móvil" },
  ];

  const handleCombustion = () => {
    push("/combustion-" + tipo);
  };

  const handleTipo = useCallback(
    (value: string) => {
      setSelectedTipo(value);
      loadCombustionCalculates(
        parseInt(selectedSede),
        parseInt(selectedAnio),
        value
      );
    },
    [loadCombustionCalculates, selectedAnio, selectedSede]
  );

  if (!combustionCalculates) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="w-full max-w-[1150px] h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex items-center gap-4">
          <ButtonBack onClick={handleCombustion} />
          <div className="font-Manrope">
            <h1 className="text-base text-gray-800 font-bold">
              Cálculo de emisiones de CO2 por combustión
            </h1>
            <h2 className="text-xs sm:text-sm text-gray-500">
              Huella de carbono
            </h2>
          </div>
        </div>
        <div className="flex flex-row sm:justify-end sm:items-center gap-5 justify-center">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center w-1/2">
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

            <ButtonCalculate
              onClick={handleCalculate}
              variant="default"
              text="Calcular"
            />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden text-nowrap sm:text-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                TIPO DE COMBUSTIBLE
              </TableHead>
              {/*<TableHead className="font-Manrope text-sm font-bold text-center">*/}
              {/*    UNIDAD*/}
              {/*</TableHead>*/}
              {/*<TableHead className="font-Manrope text-sm font-bold text-center">*/}
              {/*    CANTIDAD*/}
              {/*</TableHead>*/}
              {/*<TableHead className="font-Manrope text-sm font-bold text-center">*/}
              {/*    VALOR CALORICO NETO*/}
              {/*</TableHead>*/}
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                CONSUMO
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                EMISIONES DE CO2
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                EMISIONES DE CH4
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                EMISIONES DE N2O
              </TableHead>
              <TableHead className="text-xs sm:text-sm font-bold text-center">
                TOTAL EMISIONES GEI
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combustionCalculates.map(
              (combustionCalculate: CombustionCalcResponse) => (
                <TableRow className="text-center" key={combustionCalculate.id}>
                  <TableCell className="text-xs sm:text-sm text-start">
                    {combustionCalculate.tipoCombustible}
                  </TableCell>
                  {/*<TableCell>*/}
                  {/*    {combustionCalculate.unidad}*/}
                  {/*</TableCell>*/}
                  {/*<TableCell>*/}
                  {/*    {combustionCalculate.cantidad}*/}
                  {/*</TableCell>*/}
                  {/*<TableCell>*/}
                  {/*    {combustionCalculate.valorCalorico}*/}
                  {/*</TableCell>*/}
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary">
                      {combustionCalculate.consumo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {combustionCalculate.emisionCO2}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {combustionCalculate.emisionCH4}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {combustionCalculate.emisionN2O}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="default">
                      {combustionCalculate.totalGEI}
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
