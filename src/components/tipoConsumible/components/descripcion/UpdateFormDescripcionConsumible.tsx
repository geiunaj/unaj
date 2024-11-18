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
    DescripcionConsumibleRequest, UpdateDescripcionConsumibleProps,
} from "../../services/descripcionConsumible.interface";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    getDescripcionConsumible,
    getDescripcionConsumibleById, updateDescripcionConsumible
} from "@/components/tipoConsumible/services/descripcionConsumible.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const DescripcionConsumible = z.object({
    descripcion: z.string().min(0, "Ingrese una descripción"),
});

export function UpdateFormDescripcionConsumible({
                                                    id, onClose,
                                                }: UpdateDescripcionConsumibleProps) {
    const form = useForm<z.infer<typeof DescripcionConsumible>>({
        resolver: zodResolver(DescripcionConsumible),
        defaultValues: {},
    });

    const descripcionConsumible = useQuery({
        queryKey: ["descripcionConsumibleUF", id],
        queryFn: () => getDescripcionConsumibleById(id),
        refetchOnWindowFocus: false,
    });
    const descripciones = useQuery({
        queryKey: ['descripcionesUF'],
        queryFn: () => getDescripcionConsumible(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (descripcionConsumible.data) {
            const descripcionConsumibleData = await descripcionConsumible.data;
            form.reset({
                descripcion: descripcionConsumibleData.descripcion,
            });
        }
    }, [descripcionConsumible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof DescripcionConsumible>) => {
        const descripcionConsumibleRequest: DescripcionConsumibleRequest = {
            descripcion: data.descripcion,
        };
        try {
            const response = await updateDescripcionConsumible(id, descripcionConsumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (descripcionConsumible.isLoading || descripciones.isLoading) {
        return <SkeletonForm/>;
    }

    if (descripcionConsumible.isError || descripciones.isError) {
        onClose();
        errorToast("Error al cargar el Descripcion de Consumible");
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
                            name="descripcion"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Descripcion del tipo de consumible"
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
