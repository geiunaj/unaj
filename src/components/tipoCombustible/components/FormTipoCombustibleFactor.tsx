import React from "react";
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
import {
    CreateTipoCombustibleProps,
    TipoCombustibleRequest,
} from "../services/tipoCombustible.interface";
import {createTipoCombustible, getTiposCombustible} from "../services/tipoCombustible.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {TipoCombustibleFactorRequest} from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";
import {createTipoCombustibleFactor} from "@/components/tipoCombustible/services/tipoCombustibleFactor.actions";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getAnio} from "@/components/anio/services/anio.actions";

const TipoCombustibleFactor = z.object({
    tipoConsumibleId: z.string().min(1, "Selecciona un tipo de consumible"),
    valorCalorico: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorEmisionCO2: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorEmisionCH4: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorEmisionN2O: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    anio_id: z.string().min(1, "Selecciona un año"),
});

export function FormTipoCombustibleFactor({onClose}: CreateTipoCombustibleProps) {
    const form = useForm<z.infer<typeof TipoCombustibleFactor>>({
        resolver: zodResolver(TipoCombustibleFactor),
        defaultValues: {
            valorCalorico: 0,
            factorEmisionCO2: 0,
            factorEmisionCH4: 0,
            factorEmisionN2O: 0,
        },
    });

    const tipoCombustibles = useQuery({
        queryKey: ["tiposCombustibleCF"],
        queryFn: () => getTiposCombustible(),
        refetchOnWindowFocus: false,
    })

    const anios = useQuery({
        queryKey: ["aniosCF"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false
    });

    const onSubmit = async (data: z.infer<typeof TipoCombustibleFactor>) => {
        const tipoCombustibleFactorRequest: TipoCombustibleFactorRequest = {
            tipoCombustible_id: parseInt(data.tipoConsumibleId),
            valorCalorico: data.valorCalorico,
            factorEmisionCO2: data.factorEmisionCO2,
            factorEmisionCH4: data.factorEmisionCH4,
            factorEmisionN2O: data.factorEmisionN2O,
            anio_id: parseInt(data.anio_id),
        };
        try {
            const response = await createTipoCombustibleFactor(tipoCombustibleFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            console.error(error);
            errorToast(error.response?.data?.message);
        }
    };

    if (tipoCombustibles.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2 "
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Tipo de Consumible */}
                        <FormField
                            name="tipoConsumibleId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Nombre de Consumible</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tipoCombustibles.data!.map((tipo) => (
                                                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                        {tipo.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            {/* Valor Calorico */}
                            <FormField
                                control={form.control}
                                name="valorCalorico"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Valor Calorico</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="GAS, DIE, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* CO2 */}
                            <FormField
                                control={form.control}
                                name="factorEmisionCO2"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor CO2 [Kg CO2/TJ]</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="Litros, Galones, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-5">
                            {/* CH4 */}
                            <FormField
                                control={form.control}
                                name="factorEmisionCH4"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor CH4 [Kg CH4/TJ]
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="GAS, DIE, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* N2O */}
                            <FormField
                                control={form.control}
                                name="factorEmisionN2O"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor N2O[Kg N2O/TJ]</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="Litros, Galones, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Año */}
                        <FormField
                            control={form.control}
                            name="anio_id"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Año</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                    >
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
