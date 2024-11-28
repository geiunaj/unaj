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
    UpdateTipoPapelProps,
} from "@/components/tipoPapel/services/tipoPapel.interface";
import {
    createTipoPapel,
    getTipoPapel,
    updateTipoPapel,
} from "@/components/tipoPapel/services/tipoPapel.actions";
import {Switch} from "@/components/ui/switch";
import {useQuery} from "@tanstack/react-query";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {toast} from "sonner";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {STEP_NUMBER} from "@/lib/constants/menu";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoPapel = z
    .object({
        nombre: z.string().min(1, requiredMessage("Nombre")),
        gramaje: z.preprocess(
            parseNumber,
            z.number().min(0, requiredMessage("Gramaje mayor a 0"))
        ),
        area: z.preprocess(
            parseNumber,
            z.number().min(0, requiredMessage("Área mayor a 0"))
        ),
        hojas: z.preprocess(
            parseNumber,
            z.number().min(0, requiredMessage("Hojas mayor a 0"))
        ),
    });

export function UpdateFormTipoPapel({id, onClose}: UpdateTipoPapelProps) {
    const form = useForm<z.infer<typeof TipoPapel>>({
        resolver: zodResolver(TipoPapel),
        defaultValues: {
            nombre: "",
            gramaje: 0,
            area: 0,
            hojas: 0,
        },
    });

    const tipoPapel = useQuery({
        queryKey: ["tipoPapel"],
        queryFn: () => getTipoPapel(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoPapel.data) {
            const tipoPapelData = tipoPapel.data;
            form.reset({
                nombre: tipoPapelData.nombre,
                gramaje: tipoPapelData.gramaje,
                area: tipoPapelData.area,
                hojas: tipoPapelData.hojas,
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
            area: data.area,
            hojas: data.hojas,
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

                        {/*GRAMAJE*/}
                        <FormField
                            control={form.control}
                            name="gramaje"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Gramaje <span className="text-[10px]">[g/m²]</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            type="number"
                                            step={STEP_NUMBER}
                                            min={0}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*AREA*/}
                        <FormField
                            control={form.control}
                            name="area"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Área <span className="text-[10px]">[m²]</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            type="number"
                                            step={STEP_NUMBER}
                                            min={0}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*HOJAS*/}
                        <FormField
                            control={form.control}
                            name="hojas"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cantidad de Hojas</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            type="number"
                                            step={STEP_NUMBER}
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
