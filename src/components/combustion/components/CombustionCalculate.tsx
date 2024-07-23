"use client";
import {useEffect, useState, useCallback} from "react";
import {Button} from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {ChevronsUpDown, ListRestart, Plus, Trash2} from "lucide-react";
import {useCombustionStore} from "../lib/combustion.store";
import {
    CombustionCollection,
} from "../services/combustion.interface";
import {useSedeStore} from "@/components/sede/lib/sede.store";
import {Badge} from "@/components/ui/badge";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import {useTipoCombustibleStore} from "@/components/tipoCombustible/lib/tipoCombustible.store";
import SelectFilter from "@/components/selectFilter";

export default function CombustionCalculate() {
    // STORES
    const {combustion, loadCombustion, deleteCombustion} = useCombustionStore();
    const {tiposCombustible, loadTiposCombustible} = useTipoCombustibleStore();
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();

    // SELECTS - FILTERS
    const [selectTipoCombustible, setSelectTipoCombustible] = useState<string>("");
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(new Date().getFullYear().toString());


    useEffect(() => {
        if (tiposCombustible.length === 0) loadTiposCombustible();
        if (sedes.length === 0) loadSedes();
        if (anios.length === 0) loadAnios();
    }, [loadTiposCombustible, loadSedes, loadAnios, sedes.length, anios.length, tiposCombustible.length]);

    useEffect(() => {
        const currentYear = new Date().getFullYear().toString();

        if (anios.length > 0 && !selectedAnio) {
            const currentAnio = anios.find((anio) => anio.nombre === currentYear);
            if (currentAnio) {
                setSelectedAnio(currentAnio.id.toString());
            }
        }
    }, [anios, selectedSede, selectedAnio, selectTipoCombustible]);

    const handleTipoCombustibleChange = useCallback((value: string) => {
        setSelectTipoCombustible(value);
    }, []);

    const handleSedeChange = useCallback((value: string) => {
        setSelectedSede(value);
    }, []);

    const handleAnioChange = useCallback((value: string) => {
        setSelectedAnio(value);
    }, []);

    if (!combustion) {
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
                            list={tiposCombustible}
                            itemSelected={selectTipoCombustible}
                            handleItemSelect={handleTipoCombustibleChange}
                            value={"id"}
                            nombre={"nombre"}
                            id={"id"}
                        />
                        {selectTipoCombustible && (
                            <Button size="icon" variant="ghost" onClick={() => setSelectTipoCombustible("")}>
                                <ListRestart className="h-4 text-gray-500"/>
                            </Button>
                        )}

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
                                TIPO DE EQUIPO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                UNIDAD
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                CANTIDAD
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                VALOR CALORICO NETO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                CONSUMO
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FACTOR DE EMISIÓN DE CO2
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                EMISIONES DE CO2
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FACTOR DE EMISIÓN DE CH4
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                EMISIONES DE CH4
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                FACTOR DE EMISION DE N2O
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                EMISIONES DE N2O
                            </TableHead>
                            <TableHead className="font-Manrope text-sm font-bold text-center">
                                TOTAL EMISIONES
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
                                <TableCell> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}