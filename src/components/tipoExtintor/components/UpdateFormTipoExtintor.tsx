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
import {Button} from "../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    TipoExtintorRequest,
    UpdateTipoExtintorProps,
} from "../services/tipoExtintor.interface";
import {
    getTipoExtintorById,
    updateTipoExtintor,
} from "../services/tipoExtintor.actions";
import {useQuery} from "@tanstack/react-query";
import {errorToast, successToast} from "@/lib/utils/core.function";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoExtintor = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
});

export function UpdateFormTipoExtintor({id, onClose}: UpdateTipoExtintorProps) {
    const form = useForm<z.infer<typeof TipoExtintor>>({
        resolver: zodResolver(TipoExtintor),
        defaultValues: {
            nombre: "",
        },
    });

    const tipoExtintor = useQuery({
        queryKey: ["tipoExtintor", id],
        queryFn: () => getTipoExtintorById(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoExtintor.data) {
            const tipoExtintorData = await tipoExtintor.data;
            form.reset({
                nombre: tipoExtintorData.nombre,
            });
        }
    }, [tipoExtintor.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TipoExtintor>) => {
        const tipoExtintorRequest: TipoExtintorRequest = {
            nombre: data.nombre,
        };
        try {
            const response = await updateTipoExtintor(id, tipoExtintorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (tipoExtintor.isLoading) {
        return <SkeletonForm/>;
    }

    if (tipoExtintor.isError) {
        onClose();
        errorToast("Error al cargar el Tipo de Extintor");
    }

    return (
        <div className="flex items-center justify-center max-w-md">
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
