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

import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";
import {
    CreateTipoPapelProps,
    TipoPapelRequest,
    UpdateTipoPapelProps
} from "@/components/tipoPapel/services/tipoPapel.interface";
import {createTipoPapel, getTipoPapel, updateTipoPapel} from "@/components/tipoPapel/services/tipoPapel.actions";
import {Switch} from "@/components/ui/switch";
import {useQuery} from "@tanstack/react-query";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {toast} from "sonner";
import {errorToast, successToast} from "@/lib/utils/core.function";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoPapel = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
    gramaje: z.preprocess(parseNumber, z.number().min(1, requiredMessage("gramaje mayor a 1"))),
    unidad_paquete: z.string().min(1, requiredMessage("unidad")),
    is_certificado: z.boolean().optional(),
    is_reciclable: z.boolean().optional(),
    porcentaje_reciclado: z.preprocess(parseNumber, z.number().min(1, requiredMessage("valor mayor a 1"))).optional(),
    nombre_certificado: z.string().optional(),
})
    .refine(
        (data) => !data.is_reciclable || data.porcentaje_reciclado !== undefined,
        {
            message: "Ingrese un porcentaje de reciclado",
            path: ["porcentaje_reciclado"],
        }
    )
    .refine(
        (data) => !data.is_certificado || data.nombre_certificado?.trim() !== "",
        {
            message: "Ingrese un certificado",
            path: ["nombre_certificado"],
        }
    );

export function UpdateFormTipoPapel({id, onClose}: UpdateTipoPapelProps) {

    const form = useForm<z.infer<typeof TipoPapel>>({
        resolver: zodResolver(TipoPapel),
        defaultValues: {
            nombre: "",
            gramaje: 0,
            unidad_paquete: "",
            is_certificado: false,
            is_reciclable: false,
            porcentaje_reciclado: 0,
            nombre_certificado: "",
        },
    });

    const tipoPapel = useQuery({
        queryKey: ['tipoPapel'],
        queryFn: () => getTipoPapel(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoPapel.data) {
            const tipoPapelData = tipoPapel.data;
            form.reset({
                nombre: tipoPapelData.nombre,
                gramaje: tipoPapelData.gramaje,
                unidad_paquete: tipoPapelData.unidad_paquete,
                is_certificado: tipoPapelData.is_certificado,
                is_reciclable: tipoPapelData.is_reciclable,
                porcentaje_reciclado: tipoPapelData.porcentaje_reciclado ?? 0,
                nombre_certificado: tipoPapelData.nombre_certificado ?? "",
            });
        }
    }, [tipoPapel.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TipoPapel>) => {
        const tipoPapelRequest: TipoPapelRequest = {
            nombre: data.nombre,
            gramaje: data.gramaje,
            unidad_paquete: data.unidad_paquete,
            is_certificado: data.is_certificado,
            is_reciclable: data.is_reciclable,
            porcentaje_reciclado: data.is_reciclable ? data.porcentaje_reciclado : 0,
            nombre_certificado: data.is_certificado ? data.nombre_certificado : "",
        };
        try {
            const response = await updateTipoPapel(id, tipoPapelRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response?.data?.message);
        }
    };

    if (tipoPapel.isLoading) {
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
                        {/*NOMBRE*/}
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Nombre del tipo de papel"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            {/*GRAMAJE*/}
                            <FormField
                                control={form.control}
                                name="gramaje"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Gramaje</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*UNIDAD PAQUETE*/}
                            <FormField
                                control={form.control}
                                name="unidad_paquete"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Unidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Unidad de paquete"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-5">
                            {/*IS CERTIFICADO*/}
                            <FormField
                                control={form.control}
                                name="is_certificado"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2 flex flex-row items-center justify-between">
                                        <FormLabel className="mt-2 w-full">Certificado</FormLabel>
                                        <FormControl>
                                            <Switch
                                                className="mx-4"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*IS RECICLABLE*/}
                            <FormField
                                control={form.control}
                                name="is_reciclable"
                                render={({field}) => (
                                    <FormItem
                                        className="pt-2 w-1/2 flex flex-row items-center justify-between">
                                        <FormLabel className="mt-2 w-full">Reciclable</FormLabel>
                                        <FormControl>
                                            <Switch
                                                className="mx-4"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="flex gap-5">
                            {/*NOMBRE CERTIFICADO*/}
                            <FormField
                                control={form.control}
                                name="nombre_certificado"
                                disabled={!form.getValues().is_certificado}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Nombre Certificado</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*PORCENTAJE RECICLADO*/}
                            <FormField
                                control={form.control}
                                name="porcentaje_reciclado"
                                disabled={!form.getValues().is_reciclable}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Porcentaje Reciclado</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
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
