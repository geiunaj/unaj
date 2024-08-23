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

import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {getArea} from "@/components/area/services/area.actions";
import {
    getConsumoAguaById,
    updateConsumoAgua,
} from "../services/consumoAgua.actions";
import {UpdateElectricidadProps} from "@/components/consumoElectricidad/services/electricidad.interface";
import {consumoAguaRequest} from "../services/consumoAgua.interface";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const ConsumoAgua = z.object({
    area: z.string().min(1, "Seleccione un área"),
    codigoMedidor: z.string().min(1, "Ingrese el codigo de medidor "),
    fuenteAgua: z.string().min(1, "Ingrese la fuente de agua"),
    mes: z.string().min(1, "Seleccione un mes"),
    anio: z.string().min(1, "Seleccione un año"),
    consumo: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
});

export function UpdateFormConsumoAgua({
                                          id,
                                          onClose,
                                      }: UpdateElectricidadProps) {

    // states
    const [sede, setSede] = useState<string>("");

    const form = useForm<z.infer<typeof ConsumoAgua>>({
        resolver: zodResolver(ConsumoAgua),
        defaultValues: {
            area: "",
            codigoMedidor: "",
            fuenteAgua: "",
            mes: "",
            consumo: 0,
            anio: "",
        },
    });

    const consumoAgua = useQuery({
        queryKey: ["consumoAguaUA", id],
        queryFn: () => getConsumoAguaById(id),
        refetchOnWindowFocus: false,
    });

    const sedes = useQuery({
        queryKey: ['sedeUA'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const areas = useQuery({
        queryKey: ["areaUA"],
        queryFn: () => getArea(Number(sede)),
        refetchOnWindowFocus: false,
    });

    const anios = useQuery({
        queryKey: ["anioUA"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });
    const meses = useQuery({
        queryKey: ["mesUA"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (consumoAgua.data) {
            setSede(consumoAgua.data.area.sede_id.toString());
            const consumoAguaData = await consumoAgua.data;
            form.reset({
                area: consumoAguaData.area_id.toString(),
                codigoMedidor: consumoAguaData.codigoMedidor,
                fuenteAgua: consumoAguaData.fuenteAgua,
                mes: consumoAguaData.mes_id.toString(),
                consumo: consumoAguaData.consumo,
                anio: consumoAguaData.anio_id.toString(),
            });
        }
    }, [consumoAgua.data, id]);

    useEffect(() => {
        if (sede !== "") {
            areas.refetch();
        }
    }, [areas, sede]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    useEffect(() => {
        if (areas.data && areas.data.length > 0 && consumoAgua.data) {
            form.setValue("area", consumoAgua.data.area_id.toString());
            setSede(consumoAgua.data.area.sede_id.toString());
        }
    }, [sede, areas.data]);

    const handleSedeChange = useCallback(async (value: string) => {
        setSede(value);
    }, [areas, form]);

    const onSubmit = async (data: z.infer<typeof ConsumoAgua>) => {
        const ConsumoAguaRequest: consumoAguaRequest = {
            area_id: parseInt(data.area),
            mes_id: parseInt(data.mes),
            codigoMedidor: data.codigoMedidor,
            fuenteAgua: data.fuenteAgua,
            consumo: data.consumo,
            // sede_id: parseInt(data.sede),
            anio_id: parseInt(data.anio),
        };
        try {
            const response = await updateConsumoAgua(id, ConsumoAguaRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.respone.data.message);
        }
    };

    if (areas.isLoading || anios.isLoading || meses.isLoading || sedes.isLoading) {
        return <SkeletonForm/>;
    }

    if (areas.isError || anios.isError || meses.isError || sedes.isError) {
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
                                value={sede}
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
                                name="codigoMedidor"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Codigo del Medidor</FormLabel>
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

                            <FormField
                                name="fuenteAgua"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Fuente de Agua</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleciona la fuente de proveniente"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Pozo">Pozo</SelectItem>
                                                    <SelectItem value="Red Publica">
                                                        Red Publica
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* COSUMOS */}
                        <FormField
                            control={form.control}
                            name="consumo"
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
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el mes"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {meses.data!.map((meses) => (
                                                        <SelectItem
                                                            key={meses.id}
                                                            value={meses.id.toString()}
                                                        >
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
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {anios.data!.map((anios) => (
                                                        <SelectItem
                                                            key={anios.id}
                                                            value={anios.id.toString()}
                                                        >
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
