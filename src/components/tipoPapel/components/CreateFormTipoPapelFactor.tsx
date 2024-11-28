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

import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {getAnio} from "@/components/anio/services/anio.actions";
import {
    PapelFactorRequest,
    CreatePapelFactorProps
} from "@/components/tipoPapel/services/tipoPapelFactor.interface";
import {createFactorEmisionPapel} from "@/components/tipoPapel/services/tipoPapelFactor.actions";
import {getTiposPapel} from "@/components/tipoPapel/services/tipoPapel.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoPapelFactor = z.object({
    factor: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    tipoPapelId: z.string().min(1, "Seleccione un tipo de activo"),
    anioId: z.string().min(1, "Seleccione un año"),
});

export function CreateFormTipoPapelFactor({
                                              onClose,
                                          }: CreatePapelFactorProps) {
    const form = useForm<z.infer<typeof TipoPapelFactor>>({
        resolver: zodResolver(TipoPapelFactor),
        defaultValues: {
            factor: 0,
            tipoPapelId: "",
            anioId: "",
        },
    });

    const tiposPapel = useQuery({
        queryKey: ["tipoPapelFactorC"],
        queryFn: () => getTiposPapel(),
        refetchOnWindowFocus: false,
    });

    const anios = useQuery({
        queryKey: ["aniosFactorTipoPapelFactor"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof TipoPapelFactor>) => {
        const TipoPapelFactorRequest: PapelFactorRequest = {
            factor: data.factor,
            tipoPapelId: parseNumber(data.tipoPapelId),
            anioId: parseNumber(data.anioId),
        };
        try {
            const response = await createFactorEmisionPapel(TipoPapelFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };


    if (tiposPapel.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*TIPO DE PAPEL*/}
                        <FormField
                            name="tipoPapelId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Tipo Papel</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo Papel"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposPapel.data!.map((tipoPapel) => (
                                                    <SelectItem key={tipoPapel.id}
                                                                value={tipoPapel.id.toString()}>
                                                        {tipoPapel.nombre}
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
                                <FormItem>
                                    <FormLabel>Año</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Año"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {anios.data!.map((anio) => (
                                                    <SelectItem key={anio.id}
                                                                value={anio.id.toString()}>
                                                        {anio.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/*FACTOR*/}
                        <FormField
                            control={form.control}
                            name="factor"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Factor Equivalente
                                        <span className="text-[10px]">[kgCO2/kg]</span>
                                    </FormLabel>
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
