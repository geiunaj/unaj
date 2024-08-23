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
    CreateElectricidadProps,
    electricidadRequest,
} from "../services/electricidad.interface";
import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {createElectricidad} from "../services/electricidad.actions";
import {getArea} from "@/components/area/services/area.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const Electricidad = z.object({
    area: z.string().min(1, "Seleccione un área"),
    numero_suministro: z.string().min(1, "Ingrese un número de suministro"),
    mes: z.string().min(1, "Seleccione un mes"),
    anio: z.string().min(1, "Seleccione un año"),
    cantidad: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
});

export function FormElectricidad({onClose}: CreateElectricidadProps) {

    const [sede, setSede] = useState("1");

    const form = useForm<z.infer<typeof Electricidad>>({
        resolver: zodResolver(Electricidad),
        defaultValues: {
            area: "",
            numero_suministro: "",
            mes: "",
            cantidad: 0,
            anio: "",
        },
    });
    const sedes = useQuery({
        queryKey: ['sedeCE'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const areas = useQuery({
        queryKey: ['areaCE'],
        queryFn: () => getArea(Number(sede)),
        refetchOnWindowFocus: false,
    });

    const anios = useQuery({
        queryKey: ['anioCE'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
    const meses = useQuery({
        queryKey: ['mesCE'],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });


    const onSubmit = async (data: z.infer<typeof Electricidad>) => {
        const ElectricidadRequest: electricidadRequest = {
            area_id: parseInt(data.area),
            numeroSuministro: data.numero_suministro,
            mes_id: parseInt(data.mes),
            consumo: data.cantidad,
            anio_id: parseInt(data.anio),
        };
        try {
            const response = await createElectricidad(ElectricidadRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.respone.data.message);
        }
    };

    const handleSedeChange = useCallback(async (value: string) => {
        await setSede(value);
        await areas.refetch();
        form.setValue("area", "");
    }, [areas, form]);

    if (sedes.isLoading || anios.isLoading || meses.isLoading) {
        return <SkeletonForm/>;
    }

    if (sedes.isError || anios.isError || meses.isError) {
        return <div>Error</div>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="pt-2">
                            <FormLabel>Sede</FormLabel>
                            <Select
                                onValueChange={handleSedeChange}
                                defaultValue={sede}
                            >
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleciona tu sede"/>
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
                        </div>

                        {/* Area */}
                        <FormField
                            name="area"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Area</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona tu area"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {areas.data!.map((area) => (
                                                    <SelectItem key={area.id} value={area.id.toString()}>
                                                        {area.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="numero_suministro"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Número de Suministro</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="1234567"
                                                type="text"
                                                maxLength={8}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Cantidad */}
                            <FormField
                                control={form.control}
                                name="cantidad"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Consumo</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="kw/h"
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
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
                                                    {meses.data!.map((meses) => (
                                                        <SelectItem key={meses.id} value={meses.id.toString()}>
                                                            {meses.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
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
                                                    {anios.data!.map((anios) => (
                                                        <SelectItem key={anios.id} value={anios.id.toString()}>
                                                            {anios.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

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
