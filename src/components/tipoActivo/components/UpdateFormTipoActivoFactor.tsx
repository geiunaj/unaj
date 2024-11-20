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
    getTipoActivoById,
    getTipoActivoCategoria,
    getTipoActivoGrupo,
    getTiposActivo,
    updateTipoActivo,
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
import {
    ActivoFactorRequest,
    CreateActivoFactorProps,
    UpdateActivoFactorProps,
} from "@/components/tipoActivo/services/tipoActivoFactor.interface";
import {getAnio} from "@/components/anio/services/anio.actions";
import {
    createFactorEmisionActivo,
    getFactorEmisionActivoById,
    updateFactorEmisionActivo,
} from "@/components/tipoActivo/services/tipoActivoFactor.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoActivoFactor = z.object({
    factor: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    grupoActivoId: z.string().min(1, "Seleccione un tipo de activo"),
    anioId: z.string().min(1, "Seleccione un año"),
    fuente: z.string().min(1, "Ingrese una fuente"),
    link: z.string().optional(),
});

export function UpdateFormTipoActivoFactor({
                                               id,
                                               onClose,
                                           }: UpdateActivoFactorProps) {
    const form = useForm<z.infer<typeof TipoActivoFactor>>({
        resolver: zodResolver(TipoActivoFactor),
        defaultValues: {
            factor: 0,
            grupoActivoId: "",
            anioId: "",
            fuente: "",
            link: "",
        },
    });

    const tipoActivoFactor = useQuery({
        queryKey: ["tipoActivoFactorId", id],
        queryFn: () => getFactorEmisionActivoById(id),
        refetchOnWindowFocus: false,
    });
    const tiposActivo = useQuery({
        queryKey: ["tipoActivoFactorC"],
        queryFn: () => getTiposActivo(),
        refetchOnWindowFocus: false,
    });

    const anios = useQuery({
        queryKey: ["aniosFC"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (tipoActivoFactor.data) {
            const tipoActivoData = await tipoActivoFactor.data;
            form.reset({
                factor: tipoActivoData.factor,
                grupoActivoId: tipoActivoData.grupoActivoId.toString(),
                anioId: tipoActivoData.anioId.toString(),
                fuente: tipoActivoData.fuente,
                link: tipoActivoData.link,
            });
        }
    }, [tipoActivoFactor.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TipoActivoFactor>) => {
        const TipoActivoFactorRequest: ActivoFactorRequest = {
            factor: data.factor,
            grupoActivoId: parseInt(data.grupoActivoId),
            anioId: parseInt(data.anioId),
            fuente: data.fuente,
            link: data.link,
        };
        try {
            const response = await updateFactorEmisionActivo(
                id,
                TipoActivoFactorRequest
            );
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (tipoActivoFactor.isLoading || tiposActivo.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    if (tipoActivoFactor.isError || tiposActivo.isError || anios.isError) {
        onClose();
        errorToast("Error al cargar el Tipo de Activo");
    }

    return (
        <div className="flex items-center justify-center max-w-md">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*TIPO DE ACTIVO*/}
                        <FormField
                            name="grupoActivoId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Tipo Activo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo Activo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposActivo.data!.map((tipoActivo) => (
                                                    <SelectItem
                                                        key={tipoActivo.id}
                                                        value={tipoActivo.id.toString()}
                                                    >
                                                        {tipoActivo.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full gap-5">
                            {/*FACTOR*/}
                            <FormField
                                control={form.control}
                                name="factor"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="string"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="0"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/*AÑO*/}
                            <FormField
                                name="anioId"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {anios.data!.map((anio) => (
                                                        <SelectItem
                                                            key={anio.id}
                                                            value={anio.id.toString()}
                                                        >
                                                            {anio.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>Fuente</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Fuente"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*LINK*/}
                        <FormField
                            control={form.control}
                            name="link"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Link"
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
