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
    CreateCategoriaActivoProps,
    CategoriaActivoRequest
} from "@/components/tipoActivo/services/categoriaActivo.interface";
import {createCategoriaActivo} from "@/components/tipoActivo/services/categoriaActivo.actions";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useQuery} from "@tanstack/react-query";
import {getTipoActivoGrupo} from "@/components/tipoActivo/services/tipoActivo.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";

const requiredMessage = (field: string) => `Ingrese un ${field}`;
const CategoriaActivo = z.object({
    nombre: z.string().min(0, "Ingrese un nombre"),
    grupoActivoId: z.string().min(1, requiredMessage("grupoActivoId")),
});

export function CreateFormCategoriaActivo({
                                              onClose,
                                          }: CreateCategoriaActivoProps) {
    const form = useForm<z.infer<typeof CategoriaActivo>>({
        resolver: zodResolver(CategoriaActivo),
        defaultValues: {},
    });

    const grupos = useQuery({
        queryKey: ["gruposCategoriaActivoCreate"],
        queryFn: () => getTipoActivoGrupo(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof CategoriaActivo>) => {
        const CategoriaActivoRequest: CategoriaActivoRequest = {
            nombre: data.nombre,
            grupoActivoId: parseInt(data.grupoActivoId),
        };
        try {
            const response = await createCategoriaActivo(CategoriaActivoRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (grupos.isLoading) {
        return <SkeletonForm/>;
    }

    if (grupos.isError) {
        return <div>Error</div>;
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

                        {/*GRUPO*/}
                        <FormField
                            name="grupoActivoId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Grupo</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Grupo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {grupos.data!.map((grupo) => (
                                                    <SelectItem
                                                        key={grupo.id}
                                                        value={grupo.id.toString()}
                                                    >
                                                        {grupo.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
