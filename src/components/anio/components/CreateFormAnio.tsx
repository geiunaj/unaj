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
import {Button} from "../../ui/button";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {AnioRequest, CreateAnioProps} from "@/components/anio/services/anio.interface";
import {createAnio} from "@/components/anio/services/anio.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const Anio = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
});

export function CreateFormAnio({onClose}: CreateAnioProps) {
    const form = useForm<z.infer<typeof Anio>>({
        resolver: zodResolver(Anio),
        defaultValues: {
            nombre: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof Anio>) => {
        const anioRequest: AnioRequest = {
            nombre: data.nombre,
        };
        try {
            const response = await createAnio(anioRequest);
            onClose();
            successToast(response.data.message || "Año creado correctamente");
        } catch (error: any) {
            errorToast(error.response.data);
        }
    };

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
