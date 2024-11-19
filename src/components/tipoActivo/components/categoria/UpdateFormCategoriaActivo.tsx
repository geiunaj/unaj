import React, {useCallback, useEffect} from "react";
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
import {Button} from "../../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    CategoriaConsumibleRequest, UpdateCategoriaConsumibleProps,
} from "../../services/categoriaConsumible.interface";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    getCategoriaConsumible,
    getCategoriaConsumibleById, updateCategoriaConsumible
} from "@/components/tipoConsumible/services/categoriaConsumible.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const CategoriaConsumible = z.object({
    nombre: z.string().min(0, "Ingrese un nombre"),
});

export function UpdateFormCategoriaActivo({
                                              id, onClose,
                                          }: UpdateCategoriaConsumibleProps) {
    const form = useForm<z.infer<typeof CategoriaConsumible>>({
        resolver: zodResolver(CategoriaConsumible),
        defaultValues: {},
    });

    const categoriaConsumible = useQuery({
        queryKey: ["categoriaConsumibleUF", id],
        queryFn: () => getCategoriaConsumibleById(id),
        refetchOnWindowFocus: false,
    });
    const categoriaes = useQuery({
        queryKey: ['categoriaesUF'],
        queryFn: () => getCategoriaConsumible(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (categoriaConsumible.data) {
            const categoriaConsumibleData = await categoriaConsumible.data;
            form.reset({
                nombre: categoriaConsumibleData.nombre,
            });
        }
    }, [categoriaConsumible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof CategoriaConsumible>) => {
        const categoriaConsumibleRequest: CategoriaConsumibleRequest = {
            nombre: data.nombre,
        };
        try {
            const response = await updateCategoriaConsumible(id, categoriaConsumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (categoriaConsumible.isLoading || categoriaes.isLoading) {
        return <SkeletonForm/>;
    }

    if (categoriaConsumible.isError || categoriaes.isError) {
        onClose();
        errorToast("Error al cargar el Categoria de Consumible");
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*DESCRIPCION*/}
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
                                            placeholder="Categoria del tipo de consumible"
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
