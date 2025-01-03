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
    TipoConsumibleRequest, UpdateTipoConsumibleProps,
} from "../services/tipoConsumible.interface";
import {
    getTipoConsumibleById, getTipoConsumibleCategoria,
    getTipoConsumibleDescripcion,
    getTipoConsumibleGrupo, getTipoConsumibleProceso,
    updateTipoConsumible,
} from "../services/tipoConsumible.actions";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoConsumible = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
    unidad: z.string().min(1, requiredMessage("unidad")),
    descripcionId: z.string().min(1, requiredMessage("descripcionId")),
    categoriaId: z.string().min(1, requiredMessage("categoriaId")),
    grupoId: z.string().min(1, requiredMessage("grupoId")),
    procesoId: z.string().min(1, requiredMessage("procesoId")),
});

export function UpdateFormTipoConsumible({
                                             id, onClose,
                                         }: UpdateTipoConsumibleProps) {
    const form = useForm<z.infer<typeof TipoConsumible>>({
        resolver: zodResolver(TipoConsumible),
        defaultValues: {
            nombre: "",
            unidad: "",
            descripcionId: "",
            categoriaId: "",
            grupoId: "",
            procesoId: "",
        },
    });

    const tipoConsumible = useQuery({
        queryKey: ["tipoConsumible", id],
        queryFn: () => getTipoConsumibleById(id),
        refetchOnWindowFocus: false,
    });
    const descripciones = useQuery({
        queryKey: ['descripciones'],
        queryFn: () => getTipoConsumibleDescripcion(),
        refetchOnWindowFocus: false,
    });
    const grupos = useQuery({
        queryKey: ['grupos'],
        queryFn: () => getTipoConsumibleGrupo(),
        refetchOnWindowFocus: false,
    });
    const categorias = useQuery({
        queryKey: ['categorias'],
        queryFn: () => getTipoConsumibleCategoria(),
        refetchOnWindowFocus: false,
    });
    const procesos = useQuery({
        queryKey: ['procesos'],
        queryFn: () => getTipoConsumibleProceso(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoConsumible.data) {
            const tipoConsumibleData = await tipoConsumible.data;
            form.reset({
                nombre: tipoConsumibleData.nombre,
                unidad: tipoConsumibleData.unidad,
                descripcionId: tipoConsumibleData.descripcionId.toString(),
                categoriaId: tipoConsumibleData.categoriaId.toString(),
                grupoId: tipoConsumibleData.grupoId.toString(),
                procesoId: tipoConsumibleData.procesoId.toString(),
            });
        }
    }, [tipoConsumible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TipoConsumible>) => {
        const tipoConsumibleRequest: TipoConsumibleRequest = {
            nombre: data.nombre,
            unidad: data.unidad,
            descripcionId: Number(data.descripcionId),
            categoriaId: Number(data.categoriaId),
            grupoId: Number(data.grupoId),
            procesoId: Number(data.procesoId),
        };
        try {
            const response = await updateTipoConsumible(id, tipoConsumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (tipoConsumible.isLoading || descripciones.isLoading || grupos.isLoading || categorias.isLoading || procesos.isLoading) {
        return <SkeletonForm/>;
    }

    if (tipoConsumible.isError) {
        onClose();
        errorToast("Error al cargar el Tipo de Consumible");
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

                        {/*UNIDAD*/}
                        <FormField
                            control={form.control}
                            name="unidad"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Unidad</FormLabel>
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
                            {/*CATEGORIA*/}
                            <FormField
                                name="categoriaId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Categoría</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Categoría"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {categorias.data!.map((categoria) => (
                                                        <SelectItem key={categoria.id}
                                                                    value={categoria.id.toString()}>
                                                            {categoria.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/*PROCESO*/}
                            <FormField
                                name="procesoId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Proceso</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Proceso"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {procesos.data!.map((proceso) => (
                                                        <SelectItem key={proceso.id}
                                                                    value={proceso.id.toString()}>
                                                            {proceso.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-5">
                            {/*DESCRIPCION*/}
                            <FormField
                                name="descripcionId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Descripción</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Descripción"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {descripciones.data!.map((descripcion) => (
                                                        <SelectItem key={descripcion.id}
                                                                    value={descripcion.id.toString()}>
                                                            {descripcion.descripcion}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/*GRUPO*/}
                            <FormField
                                name="grupoId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Grupo</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Grupo"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {grupos.data!.map((grupo) => (
                                                        <SelectItem key={grupo.id}
                                                                    value={grupo.id.toString()}>
                                                            {grupo.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

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
