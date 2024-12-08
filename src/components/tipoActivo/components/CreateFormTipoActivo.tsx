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
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    CreateTipoActivoProps,
    TipoActivoRequest,
} from "../services/tipoActivo.interface";
import {
    createTipoActivo,
    getTipoActivoCategoria,
    getTipoActivoGrupo,
} from "../services/tipoActivo.actions";
import {useQuery} from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {errorToast, successToast} from "@/lib/utils/core.function";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoActivo = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
    categoriaId: z.string().min(1, requiredMessage("categoriaId")),
    peso: z.preprocess(parseNumber, z.number({message: "Ingrese un número"}).min(0, "Ingresa un valor mayor a 0")),
    fuente: z.string().optional(),
    costoUnitario: z.preprocess(parseNumber, z.number({message: "Ingrese un número"}).min(0, "Ingresa un valor mayor a 0")).optional(),
});

export function CreateFormTipoActivo({onClose}: CreateTipoActivoProps) {
    const form = useForm<z.infer<typeof TipoActivo>>({
        resolver: zodResolver(TipoActivo),
        defaultValues: {
            nombre: "",
            categoriaId: "",
            peso: 0,
            costoUnitario: 0,
            fuente: "",
        },
    });

    const categorias = useQuery({
        queryKey: ["categoriasTipoActivoCreate"],
        queryFn: () => getTipoActivoCategoria(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof TipoActivo>) => {
        const TipoActivoRequest: TipoActivoRequest = {
            nombre: data.nombre,
            categoriaId: Number(data.categoriaId),
            peso: data.peso,
            fuente: data.fuente,
            costoUnitario: data.costoUnitario,
        };
        try {
            const response = await createTipoActivo(TipoActivoRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (categorias.isLoading) {
        return <SkeletonForm/>;
    }

    if (categorias.isError) {
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
                                            placeholder="Nombre del tipo de activo"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*CATEGORIA*/}
                        <FormField
                            name="categoriaId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Categoría</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Categoría"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categorias.data!.map((categoria) => (
                                                    <SelectItem
                                                        key={categoria.id}
                                                        value={categoria.id.toString()}
                                                    >
                                                        {categoria.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5 w-full">
                            {/*PESO*/}
                            <FormField
                                control={form.control}
                                name="peso"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-full">
                                        <FormLabel>Peso [kg]</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Peso del tipo de activo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*COSTO UNITARIO*/}
                            <FormField
                                control={form.control}
                                name="costoUnitario"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-full">
                                        <FormLabel>Costo Unitario [S/.]</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Costo Unitario del tipo de activo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*FUENTE*/}
                        <FormField
                            control={form.control}
                            name="fuente"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Link del tipo de activo"
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
