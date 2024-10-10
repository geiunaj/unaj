import React from "react";
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
import {errorToast, successToast} from "@/lib/utils/core.function";
import {createProcesoConsumible} from "@/components/tipoConsumible/services/procesoConsumible.actions";
import { CreateProcesoConsumibleProps, ProcesoConsumibleRequest } from "../../services/procesoConsumible.interface";

const ProcesoConsumible = z.object({
    nombre: z.string().min(0, "Ingrese un nombre"),
});

export function CreateFormProcesoConsumible({
                                                    onClose,
                                                }: CreateProcesoConsumibleProps) {
    const form = useForm<z.infer<typeof ProcesoConsumible>>({
        resolver: zodResolver(ProcesoConsumible),
        defaultValues: {},
    });

    const onSubmit = async (data: z.infer<typeof ProcesoConsumible>) => {
        const ProcesoConsumibleRequest: ProcesoConsumibleRequest = {
            nombre: data.nombre,
        };
        try {
            const response = await createProcesoConsumible(ProcesoConsumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

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
