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
import {
    CreateDescripcionConsumibleProps,
    DescripcionConsumibleRequest
} from "@/components/tipoConsumible/services/descripcionConsumible.interface";
import {createDescripcionConsumible} from "@/components/tipoConsumible/services/descripcionConsumible.actions";

const DescripcionConsumible = z.object({
    descripcion: z.string().min(0, "Ingrese una descripción"),
});

export function CreateFormDescripcionConsumible({
                                                    onClose,
                                                }: CreateDescripcionConsumibleProps) {
    const form = useForm<z.infer<typeof DescripcionConsumible>>({
        resolver: zodResolver(DescripcionConsumible),
        defaultValues: {},
    });

    const onSubmit = async (data: z.infer<typeof DescripcionConsumible>) => {
        const DescripcionConsumibleRequest: DescripcionConsumibleRequest = {
            descripcion: data.descripcion,
        };
        try {
            const response = await createDescripcionConsumible(DescripcionConsumibleRequest);
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
