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
import {
    createTransporteTerrestreFactor
} from "@/components/transporte-terrestre-factor/services/transporteTerrestreFactor.actions";
import {
    CreateTransporteTerrestreFactorProps,
    TransporteTerrestreFactorRequest
} from "@/components/transporte-terrestre-factor/services/transporteTerrestreFactor.interface";

const TransporteTerrestreFactor = z.object({
    anio: z.string().min(1, "Seleciona el anio"),
    factor: z.preprocess((val) => parseFloat(val as string), z.number().min(0, "Ingresa un valor mayor a 0")),
});

export function FormTransporteTerrestreFactor({onClose}: CreateTransporteTerrestreFactorProps) {
    const form = useForm<z.infer<typeof TransporteTerrestreFactor>>({
        resolver: zodResolver(TransporteTerrestreFactor),
        defaultValues: {
            anio: "",
            factor: 0,
        },
    });

    const anios = useQuery({
        queryKey: ["anio"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof TransporteTerrestreFactor>) => {
        const TransporteTerrestreFactorRequest: TransporteTerrestreFactorRequest = {
            anioId: parseInt(data.anio),
            factor: data.factor,
        };

        try {
            const response = await createTransporteTerrestreFactor(TransporteTerrestreFactorRequest);
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
                            name="factor"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Factor <span className="text-[10px]">[kgCO2/km]</span></FormLabel>
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
