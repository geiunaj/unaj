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
import {errorToast, successToast} from "@/lib/utils/core.function";
import {AreaRequest, UpdateAreaProps} from "@/components/area/services/area.interface";
import {getAreaById, updateArea} from "@/components/area/services/area.actions";

const requiredMessage = (field: string) => `Ingrese un ${field}`;

const Area = z.object({
    nombre: z.string().min(1, requiredMessage("nombre"))
});

export function UpdateFormArea({id, onClose}: UpdateAreaProps) {

    const form = useForm<z.infer<typeof Area>>({
        resolver: zodResolver(Area),
        defaultValues: {
            nombre: "",
        },
    });

    const area = useQuery({
        queryKey: ['areaForm',id],
        queryFn: () => getAreaById(id),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (area.data) {
            const areaData = area.data;
            form.reset({
                nombre: areaData.nombre,
            });
        }
    }, [area.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof Area>) => {
        const areaRequest: AreaRequest = {
            nombre: data.nombre,
        };
        try {
            const response = await updateArea(id, areaRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data);
        }
    };

    if (area.isLoading) {
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
