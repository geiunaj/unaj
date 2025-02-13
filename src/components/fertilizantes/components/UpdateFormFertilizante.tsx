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
    FertilizanteRequest,
    UpdateFertilizanteProps,
} from "../services/fertilizante.interface";
import {useQuery} from "@tanstack/react-query";
import {
    getClaseFertilizante,
    getTiposFertilizante
} from "@/components/tipoFertilizante/services/tipoFertilizante.actions";
import {updateFertilizante} from "@/components/fertilizantes/services/fertilizante.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {useAnio, useFertilizanteId, useSede} from "@/components/fertilizantes/lib/fertilizante.hook";
import {successToast} from "@/lib/utils/core.function";
import {STEP_NUMBER} from "@/lib/constants/menu";
import {TipoFertilizanteCollection} from "@/components/tipoFertilizante/services/tipoFertilizante.interface";
import {formaFertilizante} from "@/lib/resources/fertilizanteResource";

const Fertilizante = z.object({
    clase: z.string().min(1, "Seleccione una clase de fertilizante"),
    tipoFertilizante_id: z.string().min(1, "Seleccione un tipo de fertilizante"),
    is_ficha: z.boolean(),
    fichatecnica: z.string().optional(),
    sede: z.string().min(1, "Seleccione una sede"),
    anio: z.string().min(1, "Seleccione un año"),
    cantidad: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
});

export function UpdateFormFertilizantes({
                                            id, onClose,
                                        }: UpdateFertilizanteProps) {

    const [tipoFertilizanteSelected, setTipoFertilizanteSelected] = useState<TipoFertilizanteCollection | null>(null);
    const form = useForm<z.infer<typeof Fertilizante>>({
        resolver: zodResolver(Fertilizante),
        defaultValues: {
            clase: "",
            tipoFertilizante_id: "",
            cantidad: 0,
            is_ficha: false,
            fichatecnica: "",
            sede: "",
            anio: "",
        },
    });

    // HOOKS
    const fertilizante = useFertilizanteId(id);
    const sedes = useSede();
    const anios = useAnio();
    const tiposFertilizante = useQuery({
        queryKey: ['tipoFertilizante'],
        queryFn: () => getTiposFertilizante(form.getValues().clase),
        refetchOnWindowFocus: false,
    });
    const claseFertilizante = useQuery({
        queryKey: ['claseFertilizante'],
        queryFn: () => getClaseFertilizante(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (fertilizante.data) {
            const fertilizanteData = await fertilizante.data;
            form.reset({
                clase: fertilizanteData.tipoFertilizante.clase,
                tipoFertilizante_id: fertilizanteData.tipoFertilizante.id.toString(),
                cantidad: fertilizanteData.cantidad,
                is_ficha: false,
                sede: fertilizanteData.sede.id.toString(),
                anio: fertilizanteData.anio.id.toString(),
            });
            const formatedFertilizante = formaFertilizante(fertilizanteData);
            setTipoFertilizanteSelected(formatedFertilizante);
        }
    }, [fertilizante.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof Fertilizante>) => {
        const fertilizanteRequest: FertilizanteRequest = {
            tipoFertilizante_id: parseInt(data.tipoFertilizante_id),
            cantidad: data.cantidad,
            sede_id: parseInt(data.sede),
            is_ficha: false,
            anio_id: parseInt(data.anio),
        };
        try {
            const response = await updateFertilizante(id, fertilizanteRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
        }
    };

    const onClaseChange = useCallback(() => {
        form.setValue("tipoFertilizante_id", "");
        tiposFertilizante.refetch();
    }, [form, tiposFertilizante]);

    if (fertilizante.isLoading || sedes.isLoading || anios.isLoading || tiposFertilizante.isLoading || claseFertilizante.isLoading) {
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
                                    <FormLabel>Clase de Fertilizante</FormLabel>
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
                                                <SelectValue placeholder="Clase de Fertilizante"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {claseFertilizante.data!.map((clase) => (
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

                        {/* Tipo de Fertilizante */}
                        <FormField
                            name="tipoFertilizante_id"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Nombre de Fertilizante</FormLabel>
                                    <Select
                                        disabled={tiposFertilizante.data!.length === 0}
                                        onValueChange={(value) => {
                                            const selectedFertilizante = tiposFertilizante.data!.find((tipo) => tipo.id.toString() === value);
                                            setTipoFertilizanteSelected(selectedFertilizante || null);
                                            field.onChange(value);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Fertilizante"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposFertilizante.data!.map((tipo) => (
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
                                        <FormLabel>
                                            Cantidad de
                                            fertilizante {tipoFertilizanteSelected ? `[${tipoFertilizanteSelected.unidad}]` : ''}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Cantidad kg/año"
                                                type="number"
                                                step={STEP_NUMBER}
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
