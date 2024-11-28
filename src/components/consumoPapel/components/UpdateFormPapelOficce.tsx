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
import {Button} from "../../ui/button";
import {
    ConsumoPapelRequest,
    UpdateConsumoPapelProps,
} from "../services/consumoPapel.interface";
import {getConsumoPapelById, updateConsumoPapel} from "../services/consumoPapel.actions";
import {Textarea} from "../../ui/textarea";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    useAnios,
    useConsumoPapelId,
    useSedes,
    useTipoPapel,
} from "../lib/consumoPapel.hook";
import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getTiposPapel} from "@/components/tipoPapel/services/tipoPapel.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import {getMes} from "@/components/mes/services/mes.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const ConsumoPapel = z.object({
    type_hoja: z.string().min(1, "Seleccione un tipo de hoja"),
    quantity_packaging: z.preprocess(
        (val) => parseInt(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    anio: z.string().min(1, "Seleccione un año"),
    mes: z.string().min(1, "Selecciona un Mes"),
    sede: z.string().min(1, "Seleccione una sede"),
});

export function UpdateFormPapel({onClose, id}: UpdateConsumoPapelProps) {
    const form = useForm<z.infer<typeof ConsumoPapel>>({
        resolver: zodResolver(ConsumoPapel),
        defaultValues: {
            type_hoja: "",
            quantity_packaging: 0,
            anio: "",
            mes: "",
            sede: "",
        },
    });

    const papel = useQuery({
        queryKey: ['papelIdUPO', id],
        queryFn: () => getConsumoPapelById(id),
        refetchOnWindowFocus: false,
    });
    const sedes = useQuery({
        queryKey: ['sedesUPO'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });
    const anios = useQuery({
        queryKey: ['aniosCPO'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const mesQuery = useQuery({
        queryKey: ["meses"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });

    const tipoPapelQuery = useQuery({
        queryKey: ['tiposPapelUPO'],
        queryFn: () => getTiposPapel(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (papel.data) {
            const consumoPapel = await papel.data;
            form.reset({
                type_hoja: consumoPapel.tipoPapel.id.toString(),
                quantity_packaging: consumoPapel.cantidad_paquete,
                anio: consumoPapel.anio_id.toString(),
                sede: consumoPapel.sede_id.toString(),
                mes: consumoPapel.mes_id.toString(),
            });
        }
    }, [papel.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof ConsumoPapel>) => {
        const consumoPapelRequest: ConsumoPapelRequest = {
            tipoPapel_id: parseInt(data.type_hoja),
            cantidad_paquete: data.quantity_packaging,
            comentario: "",
            anio_id: parseInt(data.anio),
            mes_id: parseInt(data.mes),
            sede_id: parseInt(data.sede),
        };
        try {
            const response = await updateConsumoPapel(id, consumoPapelRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (
        sedes.isLoading || tipoPapelQuery.isLoading || anios.isLoading || mesQuery.isLoading ||
        sedes.isError || mesQuery.isError || tipoPapelQuery.isError || anios.isError || !papel.data
    ) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Sede */}
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="">
                                    <FormLabel>Sede</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                        {/* Tipo de hoja */}
                        <FormField
                            name="type_hoja"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Tipo de hoja</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Papel - Unidad - % Reciclado - Certificado"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tipoPapelQuery.data!.map((tipoPapel) => (
                                                    <SelectItem
                                                        key={tipoPapel.id}
                                                        value={tipoPapel.id.toString()}
                                                    >
                                                        {tipoPapel.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />


                        {/* quantity_packaging */}
                        <FormField
                            control={form.control}
                            name="quantity_packaging"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cantidad de empaques</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Unidad/año"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            {/* año */}
                            <FormField
                                control={form.control}
                                name="anio"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
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
                                                    {anios.data!.map((anio) => (
                                                        <SelectItem
                                                            key={anio.id}
                                                            value={anio.id.toString()}
                                                        >
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
                                name="mes"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Mes</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Mes"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {mesQuery.data!.map((mes) => (
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
                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" className="w-full">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        // </div>
    );
}
