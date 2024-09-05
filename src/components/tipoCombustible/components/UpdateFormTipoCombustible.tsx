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
import {useQuery} from "@tanstack/react-query";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {toast} from "sonner";
import {
    TipoCombustibleRequest,
    UpdateTipoCombustibleProps,
} from "../services/tipoCombustible.interface";
import {
    showTipoCombustible,
    updateTipoCombustible,
} from "../services/tipoCombustible.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoCombustible = z.object({
    nombre: z.string().min(1, "Ingrese un nombre"),
    abreviatura: z.string().min(1, "Ingrese una abreviatura"),
    unidad: z.string().min(1, "Ingrese una unidad"),
   
});

export function UpdateFormTipoCombustible({
                                              id,
                                              onClose,
                                          }: UpdateTipoCombustibleProps) {
    const form = useForm<z.infer<typeof TipoCombustible>>({
        resolver: zodResolver(TipoCombustible),
        defaultValues: {
            nombre: "",
            abreviatura: "",
            unidad: "",
            
        },
    });

    const tipoCombustible = useQuery({
        queryKey: ["tipoCombustible"],
        queryFn: () => showTipoCombustible(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoCombustible.data) {
            const tipoCombustibleData = tipoCombustible.data;
            form.reset({
                nombre: tipoCombustibleData.nombre,
                abreviatura: tipoCombustibleData.abreviatura,
                unidad: tipoCombustibleData.unidad,
               
            });
        }
    }, [tipoCombustible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TipoCombustible>) => {
        const tipoCombustibleRequest: TipoCombustibleRequest = {
            nombre: data.nombre,
            abreviatura: data.abreviatura,
            unidad: data.unidad,
            
        };
        try {
            const response = await updateTipoCombustible(id, tipoCombustibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response?.data?.message);
        }
    };

    if (tipoCombustible.isLoading) {
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
                            {/*ABREVIATURA*/}
                            <FormField
                                control={form.control}
                                name="abreviatura"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Abreviatura</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                type="text"
                                                placeholder="GAS, DIE, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*UNIDAD*/}
                            <FormField
                                control={form.control}
                                name="unidad"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Unidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Unidad de medida"
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
