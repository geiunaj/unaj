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
    CreateActivoProps,
    ActivoRequest,
} from "@/components/activos/services/activos.interface";
import {errorToast, parseNumber, successToast} from "@/lib/utils/core.function";
import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {
    getTiposActivo
} from "@/components/tipoActivo/services/tipoActivo.actions";
import {createActivo} from "@/components/activos/services/activos.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {getMes} from "@/components/mes/services/mes.actions";
import { STEP_NUMBER } from "@/lib/constants/menu";

const Activo = z.object({
    tipoActivoId: z.string().min(1, "Seleccione un tipo de activo"),
    cantidadComprada: z.preprocess(parseNumber, z.number({message: "Ingrese un número"}).min(0, "Ingresa un valor mayor a 0")),
    cantidadConsumida: z.preprocess(parseNumber, z.number({message: "Ingrese un número"}).min(0, "Ingresa un valor mayor a 0")),
    sede: z.string().min(1, "Seleccione una sede"),
    anio: z.string().min(1, "Seleccione un año"),
    mes: z.string().min(1, "Seleccione un mes"),
});

export function FormActivo({onClose}: CreateActivoProps) {
    const form = useForm<z.infer<typeof Activo>>({
        resolver: zodResolver(Activo),
        defaultValues: {
            tipoActivoId: "",
            cantidadComprada: 0,
            cantidadConsumida: 0,
            sede: "",
            anio: "",
            mes: "1",
        },
    });

    // HOOKS
    const sedes = useQuery({
        queryKey: ["sede"],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
    const anios = useQuery({
        queryKey: ["anio"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
    const meses = useQuery({
        queryKey: ["mes"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
    const tiposActivo = useQuery({
        queryKey: ['tipoActivo'],
        queryFn: () => getTiposActivo(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof Activo>) => {
        const activoRequest: ActivoRequest = {
            tipoActivoId: parseInt(data.tipoActivoId),
            sedeId: parseInt(data.sede),
            anioId: parseInt(data.anio),
            mesId: parseInt(data.mes),
            cantidadConsumida: data.cantidadConsumida,
            cantidadComprada: data.cantidadComprada,
        };
        try {
            const response = await createActivo(activoRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    const onClaseChange = useCallback(() => {
        form.setValue("tipoActivoId", "");
        tiposActivo.refetch();
    }, [form, tiposActivo]);

    if (sedes.isLoading || anios.isLoading || tiposActivo.isLoading) {
        return <SkeletonForm/>;
    }

    if (sedes.isError || anios.isError || tiposActivo.isError) {
        onClose();
        errorToast("Error al cargar los datos");
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
                                        defaultValue={field.value}
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

                        {/* Tipo de Activo */}
                        <FormField
                            name="tipoActivoId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Nombre de Activo</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Activo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposActivo.data!.map((tipo) => (
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
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el mes"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {meses.data!.map((mes) => (
                                                        <SelectItem key={mes.id} value={mes.id.toString()}>
                                                            {mes.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-4">
                            {/* Cantidad Comprada */}
                            <FormField
                                control={form.control}
                                name="cantidadComprada"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-full">
                                        <FormLabel>Cantidad Comprada [UND]</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Cantidad Comprada [UND]"
                                                type="number"
                                                step={STEP_NUMBER}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Cantidad Consumida */}
                            <FormField
                                control={form.control}
                                name="cantidadConsumida"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-full">
                                        <FormLabel>Cantidad Consumida [UND]</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Cantidad Consumida [UND]"
                                                type="number"
                                                step={STEP_NUMBER}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

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
