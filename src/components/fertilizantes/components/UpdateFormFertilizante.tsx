"use client";

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
    CreateFertilizanteProps,
    FertilizanteRequest,
    fertilizanteResource,
    UpdateFertilizanteProps,
} from "../services/fertilizante.interface";
import {useSedeStore} from "@/components/sede/lib/sede.store";
import {useTipoFertilizante} from "@/components/tipoFertilizante/lib/tipoFertilizante.store";
import {useFertilizanteStore} from "../lib/fertilizante.store";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import {ClaseFertilizante, TipoFertilizante} from "@/components/tipoFertilizante/services/tipoFertilizante.interface";
import {useClaseFertilizante} from "@/components/tipoFertilizante/lib/claseFertilizante.store";

const Ferilizer = z.object({
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
                                            id,
                                            onClose,
                                        }: UpdateFertilizanteProps) {
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();
    const {tiposFertilizante, loadTiposFertilizante} = useTipoFertilizante();
    const [fertilizante, setFertilizante] = useState<fertilizanteResource>();
    const {showFertiliante, updateFertilizante} = useFertilizanteStore();
    const {claseFertilizante, loadClaseFertilizante} = useClaseFertilizante();
    const [isFicha, setIsFicha] = useState(false);
    const [filteredTipos, setFilteredTipos] = useState<TipoFertilizante[]>([]);

    const form = useForm<z.infer<typeof Ferilizer>>({
        resolver: zodResolver(Ferilizer),
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

    const loadData = async () => {
        loadSedes();
        loadAnios();
        loadTiposFertilizante();
        const fertilizanteData = await showFertiliante(id);
        setFertilizante(fertilizanteData);
        loadForm(fertilizanteData);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadClaseFertilizante();
    }, []);

    useEffect(() => {
        const tiposFertilizante1 = tiposFertilizante.filter((tf) => tf.clase === form.getValues().clase);
        setFilteredTipos(tiposFertilizante1);
        console.log(tiposFertilizante1);
    }, [tiposFertilizante]);

    const onClaseChange = useCallback(() => {
        loadTiposFertilizante();
        const tiposFiltrados = tiposFertilizante.filter((tf) => tf.clase === form.getValues().clase);
        setFilteredTipos(tiposFiltrados);
    }, [form, loadTiposFertilizante, tiposFertilizante]);

    const loadForm = useCallback((fertilizante: fertilizanteResource) => {
        if (fertilizante) {
            form.reset({
                clase: fertilizante.tipoFertilizante.clase,
                tipoFertilizante_id: fertilizante.tipoFertilizante_id?.toString() || "",
                cantidad: fertilizante.cantidad || 0,
                is_ficha: fertilizante.is_ficha || false,
                fichatecnica: fertilizante.ficha_id?.toString() || "",
                sede: fertilizante.sede_id?.toString() || "",
                anio: fertilizante.anio_id?.toString() || "",
            });
            onClaseChange();
        }
    }, [form, onClaseChange]);

    const onSubmit = async (data: z.infer<typeof Ferilizer>) => {
        const fertilizanteRequest: FertilizanteRequest = {
            tipoFertilizante_id: parseInt(data.tipoFertilizante_id),
            cantidad: data.cantidad,
            sede_id: parseInt(data.sede),
            is_ficha: data.is_ficha,
            anio_id: parseInt(data.anio),
        };
        console.log(fertilizanteRequest);
        await updateFertilizante(id, fertilizanteRequest);
        onClose();
    };

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
                                                {sedes.map((sede) => (
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
                                                {claseFertilizante.map((clase) => (
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
                                        disabled={filteredTipos.length === 0}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Fertilizante"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {filteredTipos.map((tipo) => (
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
                                        <FormLabel>Cantidad de fertilizante</FormLabel>
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
                                                    {anios.map((anio) => (
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
