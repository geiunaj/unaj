import React, {useCallback, useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useQuery} from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {getAnio} from "@/components/anio/services/anio.actions";
import {
    getFactorEmisionVehiculoById,
    updateFactorEmisionVehiculo
} from "@/components/tipoVehiculo/services/tipoVehiculoFactor.actions";
import {
    VehiculoFactorRequest,
    UpdateVehiculoFactorProps
} from "@/components/tipoVehiculo/services/tipoVehiculoFactor.interface";
import {getTiposVehiculo} from "@/components/tipoVehiculo/services/tipoVehiculo.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoVehiculoFactor = z.object({
    factorCO2: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorCH4: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorN2O: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factor: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    tipoVehiculoId: z.string().min(1, "Seleccione un tipo de activo"),
    anioId: z.string().min(1, "Seleccione un año"),
    fuente: z.string().min(1, "Ingrese una fuente"),
    link: z.string().optional(),
});

export function UpdateFormTipoVehiculoFactor({
                                                 id,
                                                 onClose,
                                             }: UpdateVehiculoFactorProps) {
    const form = useForm<z.infer<typeof TipoVehiculoFactor>>({
        resolver: zodResolver(TipoVehiculoFactor),
        defaultValues: {
            factorCO2: 0,
            factorCH4: 0,
            factorN2O: 0,
            factor: 0,
            tipoVehiculoId: "",
            anioId: "",
            fuente: "",
            link: "",
        },
    });

    const tipoVehiculoFactor = useQuery({
        queryKey: ["tipoVehiculoFactorId", id],
        queryFn: () => getFactorEmisionVehiculoById(id),
        refetchOnWindowFocus: false,
    });
    const tiposVehiculo = useQuery({
        queryKey: ["tipoVehiculoFactorU"],
        queryFn: () => getTiposVehiculo(),
        refetchOnWindowFocus: false,
    });

    const anios = useQuery({
        queryKey: ["aniosFC"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoVehiculoFactor.data) {
            const tipoVehiculoData = await tipoVehiculoFactor.data;
            form.reset({
                factorCO2: tipoVehiculoData.factorCO2,
                factorCH4: tipoVehiculoData.factorCH4,
                factorN2O: tipoVehiculoData.factorN2O,
                factor: tipoVehiculoData.factor,
                tipoVehiculoId: tipoVehiculoData.tipoVehiculoId.toString(),
                anioId: tipoVehiculoData.anioId.toString(),
                fuente: tipoVehiculoData.fuente ?? "",
                link: tipoVehiculoData.link ?? "",
            });
        }
    }, [tipoVehiculoFactor.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TipoVehiculoFactor>) => {
        const TipoVehiculoFactorRequest: VehiculoFactorRequest = {
            factorCO2: data.factorCO2,
            factorCH4: data.factorCH4,
            factorN2O: data.factorN2O,
            factor: data.factor,
            tipoVehiculoId: parseNumber(data.tipoVehiculoId),
            anioId: parseNumber(data.anioId),
            fuente: data.fuente,
            link: data.link,
        };
        try {
            const response = await updateFactorEmisionVehiculo(
                id,
                TipoVehiculoFactorRequest
            );
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (tipoVehiculoFactor.isLoading || tiposVehiculo.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    if (tipoVehiculoFactor.isError || tiposVehiculo.isError || anios.isError) {
        onClose();
        errorToast("Error al cargar el Tipo de Vehiculo");
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*TIPO DE ACTIVO*/}
                        <FormField
                            name="tipoVehiculoId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Grupo Vehiculo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Grupo Vehiculo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposVehiculo.data!.map((tipoVehiculo) => (
                                                    <SelectItem key={tipoVehiculo.id}
                                                                value={tipoVehiculo.id.toString()}>
                                                        {tipoVehiculo.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />


                        {/*AÑO*/}
                        <FormField
                            name="anioId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Año</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Año"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {anios.data!.map((anio) => (
                                                    <SelectItem
                                                        key={anio.id}
                                                        value={anio.id.toString()}
                                                    >
                                                        {anio.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full gap-5">
                            {/*FACTOR CO2*/}
                            <FormField
                                control={form.control}
                                name="factorCO2"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor CO2 <span className="text-[9px]">[kgCO2/Km]</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="0"
                                                step={0.00000000001}
                                                min={0}
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    field.onChange(newValue);
                                                    const factorCO2 = Number(newValue || 0);
                                                    const factorCH4 = Number(form.getValues("factorCH4") || 0);
                                                    const factorN2O = Number(form.getValues("factorN2O") || 0);
                                                    form.setValue("factor", parseFloat((factorCO2 + (factorCH4 * 30) + (factorN2O * 265)).toFixed(6)));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*FACTOR CH4*/}
                            <FormField
                                control={form.control}
                                name="factorCH4"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor CH4 <span
                                            className="text-[9px]">[kgCO2eq/Km]</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="0"
                                                step={0.00000000001}
                                                min={0}
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    field.onChange(newValue);
                                                    const factorCO2 = Number(form.getValues("factorCO2") || 0);
                                                    const factorCH4 = Number(newValue || 0);
                                                    const factorN2O = Number(form.getValues("factorN2O") || 0);
                                                    form.setValue("factor", parseFloat((factorCO2 + (factorCH4 * 30) + (factorN2O * 265)).toFixed(6)));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex w-full gap-5">
                            {/*FACTOR N2O*/}
                            <FormField
                                control={form.control}
                                name="factorN2O"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor N2O <span
                                            className="text-[9px]">[kgCO2eq/Km]</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="0"
                                                step={0.00000000001}
                                                min={0}
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    field.onChange(newValue);
                                                    const factorCO2 = Number(form.getValues("factorCO2") || 0);
                                                    const factorCH4 = Number(form.getValues("factorCH4") || 0);
                                                    const factorN2O = Number(newValue || 0);
                                                    form.setValue("factor", parseFloat((factorCO2 + (factorCH4 * 30) + (factorN2O * 265)).toFixed(6)));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*FACTOR*/}
                            <FormField
                                control={form.control}
                                name="factor"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor Equivalente <span
                                            className="text-[9px]">[kgCO2eq/Km]</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="0"
                                                step={0.00000000001}
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*FUENTE*/}
                        <FormField
                            control={form.control}
                            name="fuente"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Fuente</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Fuente"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*LINK*/}
                        <FormField
                            control={form.control}
                            name="link"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Link"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" className="w-full bg-primary">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
