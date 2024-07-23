"use client";
import {useEffect, useState, useCallback} from "react";
import {Button} from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {ListRestart} from "lucide-react";
import {useCombustionStore} from "../lib/combustion.store";
import {useSedeStore} from "@/components/sede/lib/sede.store";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import SelectFilter from "@/components/selectFilter";
import {useCombustionCalculateStore} from "@/components/combustion/lib/combustionCalculate.store";
import {CombustionCalcResponse} from "@/components/combustion/services/combustionCalculate.interface";
import {Badge} from "@/components/ui/badge";

export default function CombustionCalculate() {
    // STORES
    const {combustionCalculates, loadCombustionCalculates, createCombustionCalculate} = useCombustionCalculateStore();
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(new Date().getFullYear().toString());


    useEffect(() => {
        if (sedes.length === 0) loadSedes();
        if (anios.length === 0) loadAnios();
        if (combustionCalculates.length === 0) loadCombustionCalculates(parseInt(selectedSede), parseInt(selectedAnio));
    }, [loadCombustionCalculates, loadSedes, loadAnios, sedes.length, anios.length, selectedSede, selectedAnio, combustionCalculates.length]);

    const handleSedeChange = useCallback((value: string) => {
        setSelectedSede(value);
        loadCombustionCalculates(parseInt(value), parseInt(selectedAnio));
    }, [loadCombustionCalculates, selectedAnio]);

    const handleAnioChange = useCallback((value: string) => {
        setSelectedAnio(value);
        loadCombustionCalculates(parseInt(selectedSede), parseInt(value));
    }, [loadCombustionCalculates, selectedSede]);

    if (!combustionCalculates) {
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
                </div>
            </div>

            <div className="rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
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
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                EMISIONES DE CO2
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                EMISIONES DE CH4
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                EMISIONES DE N2O
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                TOTAL EMISIONES GEI
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            combustionCalculates.map((combustionCalculate: CombustionCalcResponse) => (
                                <TableRow className="text-center" key={combustionCalculate.id}>
                                    <TableCell className="text-start">
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
                                    <TableCell>
                                        <Badge variant="secondary">{combustionCalculate.consumo}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {combustionCalculate.emisionCO2}
                                    </TableCell>
                                    <TableCell>
                                        {combustionCalculate.emisionCH4}
                                    </TableCell>
                                    <TableCell>
                                        {combustionCalculate.emisionN2O}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">{combustionCalculate.totalGEI}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}