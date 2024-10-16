import React, {useEffect} from "react";
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
import {getAnio} from "@/components/anio/services/anio.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {createTransporteAereoFactor} from "@/components/transporte-aereo-factor/services/transporteAereoFactor.actions";
import {
    CreateTransporteAereoFactorProps,
    TransporteAereoFactorRequest
} from "@/components/transporte-aereo-factor/services/transporteAereoFactor.interface";

const TransporteAereoFactor = z.object({
    anio: z.string().min(1, "Seleciona el anio"),
    factor1600: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    factor1600_3700: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    factor3700: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
});

export function FormTransporteAereoFactor({onClose}: CreateTransporteAereoFactorProps) {
    const form = useForm<z.infer<typeof TransporteAereoFactor>>({
        resolver: zodResolver(TransporteAereoFactor),
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

    const onSubmit = async (data: z.infer<typeof TransporteAereoFactor>) => {
        const TransporteAereoFactorRequest: TransporteAereoFactorRequest = {
            anioId: parseInt(data.anio),
            factor1600: data.factor1600,
            factor1600_3700: data.factor1600_3700,
            factor3700: data.factor3700,
        };

        try {
            const response = await createTransporteAereoFactor(TransporteAereoFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            console.log(error);
            errorToast(error.response.data || error.response.data.message);
        }
    };

    if (anios.isLoading) {
        return <SkeletonForm/>;
    }

    if (anios.isError) {
        return <div>Error</div>;
    }

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="anio"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Año</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona tu sede"/>
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
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="factor1600"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor Mayor a 1600</FormLabel>
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
                                    <FormLabel>Factor entre 1600 y 3700</FormLabel>
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
                            name="factor3700"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor Mayor a 3700</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            type="number"
                                            step="0.01"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" className="w-full bg-blue-700">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
