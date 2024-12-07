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
import {getAnio, getTipoExtintor} from "@/components/anio/services/anio.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    createExtintorFactor
} from "@/components/extintorFactor/services/extintorFactor.actions";
import {
    CreateExtintorFactorProps,
    ExtintorFactorRequest
} from "@/components/extintorFactor/services/extintorFactor.interface";
import {STEP_NUMBER} from "@/lib/constants/menu";

const ExtintorFactor = z.object({
    anio: z.string().min(1, "Seleciona el año"),
    tipoExtintorId: z.string().min(1, "Seleciona el tipo de extintor"),
    factor: z.preprocess((val) => parseFloat(val as string), z.number({message: "Ingresa un valor numerico"}).min(0, "Ingresa un valor mayor a 0")),
});

export function FormExtintorFactor({onClose}: CreateExtintorFactorProps) {
    const form = useForm<z.infer<typeof ExtintorFactor>>({
        resolver: zodResolver(ExtintorFactor),
        defaultValues: {
            anio: "",
            tipoExtintorId: "",
            factor: 0,
        },
    });

    const anios = useQuery({
        queryKey: ["anio"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const tiposExtintor = useQuery({
        queryKey: ["tiposExtintorPage"],
        queryFn: () => getTipoExtintor(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof ExtintorFactor>) => {
        const ExtintorFactorRequest: ExtintorFactorRequest = {
            anioId: parseInt(data.anio),
            factor: data.factor,
            tipoExtintorId: parseInt(data.tipoExtintorId),
        };

        try {
            await createExtintorFactor(ExtintorFactorRequest);
            onClose();
            successToast("Factor de Extintor creado correctamente");
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (anios.isLoading || tiposExtintor.isLoading) {
        return <SkeletonForm/>;
    }

    if (anios.isError || tiposExtintor.isError) {
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
                            name="tipoExtintorId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Tipo de Extintor</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona el tipo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposExtintor.data!.map((tipoExtintor) => (
                                                    <SelectItem key={tipoExtintor.id}
                                                                value={tipoExtintor.id.toString()}>
                                                        {tipoExtintor.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

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
                                                <SelectValue placeholder="Seleciona el año"/>
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
                                    <FormLabel>Factor</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Factor"
                                            step={STEP_NUMBER}
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
