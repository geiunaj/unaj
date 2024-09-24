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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {
    ConsumibleRequest,
    UpdateConsumibleProps,
} from "@/components/consumibles/services/consumible.interface";
import {useQuery} from "@tanstack/react-query";
import {
    getClaseConsumible,
    getTiposConsumible
} from "@/components/tipoConsumible/services/tipoConsumible.actions";
import {updateConsumible} from "@/components/consumibles/services/consumible.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useAnio, useConsumibleId, useSede} from "@/components/consumibles/lib/consumible.hook";
import {successToast} from "@/lib/utils/core.function";

const Consumible = z.object({
    clase: z.string().min(1, "Seleccione una clase de consumible"),
    tipoConsumible_id: z.string().min(1, "Seleccione un tipo de consumible"),
    is_ficha: z.boolean(),
    fichatecnica: z.string().optional(),
    sede: z.string().min(1, "Seleccione una sede"),
    anio: z.string().min(1, "Seleccione un año"),
    cantidad: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
});

export function UpdateFormConsumible({
                                         id, onClose,
                                     }: UpdateConsumibleProps) {
    const [isFicha, setIsFicha] = useState(false);

    const form = useForm<z.infer<typeof Consumible>>({
        resolver: zodResolver(Consumible),
        defaultValues: {
            clase: "",
            tipoConsumible_id: "",
            cantidad: 0,
            is_ficha: false,
            fichatecnica: "",
            sede: "",
            anio: "",
        },
    });

    // HOOKS
    const consumible = useConsumibleId(id);
    const sedes = useSede();
    const anios = useAnio();
    const tiposConsumible = useQuery({
        queryKey: ['tipoConsumible'],
        queryFn: () => getTiposConsumible(form.getValues().clase),
        refetchOnWindowFocus: false,
    });
    const claseConsumible = useQuery({
        queryKey: ['claseConsumible'],
        queryFn: () => getClaseConsumible(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (consumible.data) {
            const consumibleData = await consumible.data;
            form.reset({
                clase: consumibleData.tipoConsumible.clase,
                tipoConsumible_id: consumibleData.tipoConsumible.id.toString(),
                cantidad: consumibleData.cantidad,
                is_ficha: consumibleData.is_ficha,
                sede: consumibleData.sede.id.toString(),
                anio: consumibleData.anio.id.toString(),
            });
        }
    }, [consumible.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof Consumible>) => {
        const consumibleRequest: ConsumibleRequest = {
            tipoConsumible_id: parseInt(data.tipoConsumible_id),
            cantidad: data.cantidad,
            sede_id: parseInt(data.sede),
            is_ficha: data.is_ficha,
            anio_id: parseInt(data.anio),
        };
        try {
            const response = await updateConsumible(id, consumibleRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            // console.log(error.response.data);
        }
    };

    const onClaseChange = useCallback(() => {
        form.setValue("tipoConsumible_id", "");
        tiposConsumible.refetch();
    }, [form, tiposConsumible]);

    if (consumible.isLoading || sedes.isLoading || anios.isLoading || tiposConsumible.isLoading || claseConsumible.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Sede */}
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Sede</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona tu sede"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {sedes.data!.map((sede) => (
                                                    <SelectItem key={sede.id} value={sede.id.toString()}>
                                                        {sede.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Clase */}
                        <FormField
                            name="clase"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Clase de Consumible</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            onClaseChange();
                                        }}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Clase de Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {claseConsumible.data!.map((clase) => (
                                                    <SelectItem key={clase.nombre} value={clase.nombre}>
                                                        {clase.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/* Tipo de Consumible */}
                        <FormField
                            name="tipoConsumible_id"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Nombre de Consumible</FormLabel>
                                    <Select
                                        disabled={tiposConsumible.data!.length === 0}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposConsumible.data!.map((tipo) => (
                                                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                        {tipo.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            {/* Cantidad */}
                            <FormField
                                control={form.control}
                                name="cantidad"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Cantidad de consumible</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Cantidad Kg/año"
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* Año */}
                            <FormField
                                control={form.control}
                                name="anio"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {anios.data!.map((anio) => (
                                                        <SelectItem key={anio.id} value={anio.id.toString()}>
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

                        {/* is_ficha */}
                        <FormField
                            control={form.control}
                            name="is_ficha"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <div className="flex justify-between">
                                        <FormLabel>Ficha técnica</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {isFicha && (
                            <FormField
                                control={form.control}
                                name="fichatecnica"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded mt-1 focus:outline-none focus-visible:ring-offset-0"
                                                type="file"
                                                placeholder="Suba la ficha tecnica"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
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
