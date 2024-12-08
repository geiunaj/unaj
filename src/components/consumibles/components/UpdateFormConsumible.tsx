import React, {useCallback, useEffect, useState} from "react";
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
import {Button} from "@/components/ui/button";
import {
    ConsumibleRequest,
    UpdateConsumibleProps,
} from "@/components/consumibles/services/consumible.interface";
import {useQuery} from "@tanstack/react-query";
import {
    getTiposConsumible
} from "@/components/tipoConsumible/services/tipoConsumible.actions";
import {updateConsumible} from "@/components/consumibles/services/consumible.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useAnio, useConsumibleId, useSede} from "@/components/consumibles/lib/consumible.hook";
import {successToast} from "@/lib/utils/core.function";
import {getMes} from "@/components/mes/services/mes.actions";
import {STEP_NUMBER} from "@/lib/constants/menu";

const Consumible = z.object({
    tipoConsumibleId: z.string().min(1, "Seleccione un tipo de consumible"),
    pesoTotal: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    sede: z.string().min(1, "Seleccione una sede"),
    anio: z.string().min(1, "Seleccione un año"),
    mes: z.string().min(1, "Seleccione un mes"),
});

export function UpdateFormConsumible({
                                         id, onClose,
                                     }: UpdateConsumibleProps) {
    const form = useForm<z.infer<typeof Consumible>>({
        resolver: zodResolver(Consumible),
        defaultValues: {
            tipoConsumibleId: "",
            pesoTotal: 0,
            sede: "",
            anio: "",
            mes: "1",
        },
    });

    // HOOKS
    const consumible = useConsumibleId(id);
    const sedes = useSede();
    const anios = useAnio();
    const meses = useQuery({
        queryKey: ["mes"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
    const tiposConsumible = useQuery({
        queryKey: ['tipoConsumible'],
        queryFn: () => getTiposConsumible(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (consumible.data) {
            const consumibleData = await consumible.data;
            form.reset({
                tipoConsumibleId: consumibleData.tipoConsumibleId.toString(),
                pesoTotal: consumibleData.pesoTotal,
                sede: consumibleData.sedeId.toString(),
                anio: consumibleData.anioId.toString(),
                mes: consumibleData.mesId.toString(),
            });
        }
    }, [consumible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof Consumible>) => {
        const consumibleRequest: ConsumibleRequest = {
            tipoConsumibleId: parseInt(data.tipoConsumibleId),
            pesoTotal: data.pesoTotal,
            sedeId: parseInt(data.sede),
            anioId: parseInt(data.anio),
            mesId: parseInt(data.mes),
        };
        try {
            const response = await updateConsumible(id, consumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            // console.log(error.response.data);
        }
    };

    if (consumible.isLoading || sedes.isLoading || anios.isLoading || tiposConsumible.isLoading || meses.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Sede */}
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Sede</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona tu sede"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {sedes.data!.map((sede) => (
                                                    <SelectItem key={sede.id} value={sede.id.toString()}>
                                                        {sede.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Tipo de Consumible */}
                        <FormField
                            name="tipoConsumibleId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Nombre de Consumible</FormLabel>
                                    <Select
                                        disabled={tiposConsumible.data!.length === 0}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposConsumible.data!.map((tipo) => (
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

                        <div className="flex gap-4">
                            {/* Año */}
                            <FormField
                                control={form.control}
                                name="anio"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
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
                            {/* Mes */}
                            <FormField
                                control={form.control}
                                name="mes"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Mes</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {meses.data!.map((anio) => (
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
                        </div>

                        {/* Peso total */}
                        <FormField
                            control={form.control}
                            name="pesoTotal"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Peso Total de Consumible <span
                                        className="text-[10px]">[kg]</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Cantidad kg/año"
                                            type="number"
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
