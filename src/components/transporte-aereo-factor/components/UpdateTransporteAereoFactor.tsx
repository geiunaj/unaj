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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";

import {useQuery} from "@tanstack/react-query";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    UpdateTransporteAereoFactorProps,
    TransporteAereoFactorRequest
} from "../services/transporteAereoFactor.interface";
import {getAnio} from "@/components/anio/services/anio.actions";
import {showTransporteAereoFactor, updateTransporteAereoFactor} from "../services/transporteAereoFactor.actions";

const UpdateTransporteAereoFactor = z.object({
    anio: z.string().min(1, "Selecciona un año"),
    factor1600: z.preprocess((val) => parseFloat(val as string), z.number().min(0, "Ingresa un valor mayor a 0")),
    factor1600_3700: z.preprocess((val) => parseFloat(val as string), z.number().min(0, "Ingresa un valor mayor a 0")),
    factor3700: z.preprocess((val) => parseFloat(val as string), z.number().min(0, "Ingresa un valor mayor a 0")),
});

export function UpdateFormTransporteAereoFactor({id, onClose}: UpdateTransporteAereoFactorProps) {
    const form = useForm<z.infer<typeof UpdateTransporteAereoFactor>>({
        resolver: zodResolver(UpdateTransporteAereoFactor),
        defaultValues: {
            anio: "",
            factor1600: 0,
            factor1600_3700: 0,
            factor3700: 0,
        },
    });

    const anios = useQuery({
        queryKey: ["anio"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const transporteAereoFactor = useQuery({
        queryKey: ["transporteAereoFactor"],
        queryFn: () => showTransporteAereoFactor(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (transporteAereoFactor.data) {
            const factorData = await transporteAereoFactor.data;
            form.reset({
                anio: factorData.anio_id.toString(),
                factor1600: factorData.factor1600,
                factor1600_3700: factorData.factor1600_3700,
                factor3700: factorData.factor3700,
            });
        }
    }, [transporteAereoFactor.data, form]);

    useEffect(() => {
        loadForm();
    }, [loadForm]);

    const onSubmit = async (data: z.infer<typeof UpdateTransporteAereoFactor>) => {
        const transporteAereoFactorRequest: TransporteAereoFactorRequest = {
            anioId: parseInt(data.anio),
            factor1600: data.factor1600,
            factor1600_3700: data.factor1600_3700,
            factor3700: data.factor3700,
        };

        try {
            const response = await updateTransporteAereoFactor(id, transporteAereoFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response?.data?.message || "Error actualizando factor de emisión");
        }
    };

    if (transporteAereoFactor.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form className="w-full flex flex-col gap-3 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Año */}
                        <FormField
                            control={form.control}
                            name="anio"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Año</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el año"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {anios.data!.map((anio) => (
                                                    <SelectItem key={anio.id} value={anio.id.toString()}>
                                                        {anio.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="factor1600"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor Menor 1600 <span
                                        className="text-[10px]">[kgCO2/km]</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Factor de emisión CO2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="factor1600_3700"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor entre 1600 y 3700 <span
                                        className="text-[10px]">[kgCO2/km]</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Factor de emisión CH4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Factor N2O */}
                        <FormField
                            control={form.control}
                            name="factor3700"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor Mayor 3700 <span
                                        className="text-[10px]">[kgCO2/km]</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Factor de emisión N2O"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Botón Guardar */}
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
