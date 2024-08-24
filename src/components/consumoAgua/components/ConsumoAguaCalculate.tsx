"use client";
import {useState, useCallback} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SelectFilter from "@/components/SelectFilter";
import {Badge} from "@/components/ui/badge";
import {useRouter} from "next/navigation";
import ButtonCalculate from "@/components/ButtonCalculate";
import ButtonBack from "@/components/ButtonBack";
import {
    useAnio,
    useElectricidadCalculos,
    useSede
} from "@/components/consumoElectricidad/lib/electricidadCalculos.hooks";
import SkeletonTable from "@/components/Layout/skeletonTable";
import {electricidadCalculosResource} from "@/components/consumoElectricidad/services/electricidadCalculos.interface";
import {createCalculosElectricidad} from "@/components/consumoElectricidad/services/electricidadCalculos.actions";
import {Building, Calendar} from "lucide-react";
import CustomPagination from "@/components/Pagination";

export default function ConsumoAguaCalculate() {
    const {push} = useRouter();

    // SELECTS - FILTERS
    const [selectedSede, setSelectedSede] = useState<string>("1");
    const [selectedAnio, setSelectedAnio] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [selectedArea, setsSelectedArea] = useState<string>("1");
    const [page, setPage] = useState<number>(1);

    const sedes = useSede();
    const anios = useAnio();

    // HOOKS
    const electricidadCalculos = useElectricidadCalculos({
        sedeId: selectedSede ? Number(selectedSede) : undefined,
        anio: selectedAnio ? Number(selectedAnio) : undefined,
        page,
    });

    // HANDLES
    const handleSedeChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedSede(value);
        await electricidadCalculos.refetch();
    }, [electricidadCalculos]);

    const handleAnioChange = useCallback(async (value: string) => {
        await setPage(1);
        await setSelectedAnio(value);
        await electricidadCalculos.refetch();
    }, [electricidadCalculos]);

    const handleCalculate = useCallback(async () => {
        await createCalculosElectricidad({
            sedeId: selectedSede ? Number(selectedSede) : undefined,
            anio: selectedAnio ? Number(selectedAnio) : undefined,
        });
        electricidadCalculos.refetch();
    }, [selectedSede, selectedAnio, page, electricidadCalculos]);

    const handleCombustion = () => {
        push("/electricidad");
    };

    const handlePageChange = useCallback(async (page: number) => {
        await setPage(page);
        await electricidadCalculos.refetch();
    }, [electricidadCalculos]);

    if (electricidadCalculos.isLoading || sedes.isLoading || anios.isLoading) {
        return <SkeletonTable/>;
    }

    if (electricidadCalculos.isError || sedes.isError || anios.isError) {
        return <div>Error</div>;
    }

    return (
        <div className="w-full max-w-[1150px] h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex items-center gap-4">
                    <ButtonBack onClick={handleCombustion}/>
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
                    <div
                        className="flex flex-col sm:flex-row gap-1 sm:gap-4 font-normal sm:justify-end sm:items-center sm:w-full w-1/2">

                        <SelectFilter
                            list={sedes.data!}
                            itemSelected={selectedSede}
                            handleItemSelect={handleSedeChange}
                            value={"id"}
                            nombre={"name"}
                            id={"id"}
                            all={true}
                            icon={<Building className="h-3 w-3"/>}
                        />

                        <SelectFilter
                            list={anios.data!}
                            itemSelected={selectedAnio}
                            handleItemSelect={handleAnioChange}
                            value={"nombre"}
                            nombre={"nombre"}
                            id={"id"}
                            icon={<Calendar className="h-3 w-3"/>}
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
                                AREA
                            </TableHead>
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
                        {electricidadCalculos.data!.data.map(
                            (electricidadCalculosResource: electricidadCalculosResource) => (
                                <TableRow className="text-center" key={electricidadCalculosResource.id}>
                                    <TableCell className="text-xs sm:text-sm text-start">
                                        {electricidadCalculosResource.area}
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
                                            {electricidadCalculosResource.consumoTotal}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {electricidadCalculosResource.emisionCO2}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {electricidadCalculosResource.emisionCH4}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {electricidadCalculosResource.emisionN2O}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <Badge variant="default">
                                            {electricidadCalculosResource.totalGEI}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {
                    electricidadCalculos.data!.meta.totalPages > 1 && (
                        <CustomPagination meta={electricidadCalculos.data!.meta} onPageChange={handlePageChange}/>
                    )
                }
            </div>
        </div>
    );
}
