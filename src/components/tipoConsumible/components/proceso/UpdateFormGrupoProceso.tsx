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
    ProcesoConsumibleRequest, UpdateProcesoConsumibleProps,
} from "../../services/procesoConsumible.interface";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    getProcesoConsumible,
    getProcesoConsumibleById, updateProcesoConsumible
} from "@/components/tipoConsumible/services/procesoConsumible.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const ProcesoConsumible = z.object({
    nombre: z.string().min(0, "Ingrese un nombre"),
});

export function UpdateFormProcesoConsumible({
                                                    id, onClose,
                                                }: UpdateProcesoConsumibleProps) {
    const form = useForm<z.infer<typeof ProcesoConsumible>>({
        resolver: zodResolver(ProcesoConsumible),
        defaultValues: {},
    });

    const procesoConsumible = useQuery({
        queryKey: ["procesoConsumibleUF", id],
        queryFn: () => getProcesoConsumibleById(id),
        refetchOnWindowFocus: false,
    });
    const procesoes = useQuery({
        queryKey: ['procesoesUF'],
        queryFn: () => getProcesoConsumible(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (procesoConsumible.data) {
            const procesoConsumibleData = await procesoConsumible.data;
            form.reset({
                nombre: procesoConsumibleData.nombre,
            });
        }
    }, [procesoConsumible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof ProcesoConsumible>) => {
        const procesoConsumibleRequest: ProcesoConsumibleRequest = {
            nombre: data.nombre,
        };
        try {
            const response = await updateProcesoConsumible(id, procesoConsumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (procesoConsumible.isLoading || procesoes.isLoading) {
        return <SkeletonForm/>;
    }

    if (procesoConsumible.isError || procesoes.isError) {
        onClose();
        errorToast("Error al cargar el Proceso de Consumible");
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
                                            placeholder="Proceso del tipo de consumible"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

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
