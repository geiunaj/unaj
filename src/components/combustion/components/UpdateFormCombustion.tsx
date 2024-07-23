"use client";

import React, {useEffect} from "react";
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
import {Button} from "../../ui/button";
import {useSedeStore} from "@/components/sede/lib/sede.store";
import {useTipoCombustibleStore} from "@/components/tipoCombustible/lib/tipoCombustible.store";
import {
    CombustionResource,
    CombustionRequest,
    UpdateCombustionProps,
} from "../services/combustion.interface";
import {useCombustionStore} from "../lib/combustion.store";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import {useMesStore} from "@/components/mes/lib/mes.stores";
import {updateCombustion} from "../services/combustion.actions";

const Combustion = z.object({
    sede: z.string().min(1, "Selecciona la sede"),
    type_equipment: z.string().min(1, "Ingresa el tipo de equipo"),
    type_combustion: z.string().min(1, "Selecciona el tipo de combustible"),
    mes: z.string().min(1, "Selecciona el mes"),
    anio: z.string().min(1, "Selecciona el año"),
    consumo: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
});

export function UpdateFormCombustion({
                                         id,
                                         tipo,
                                         onClose,
                                     }: UpdateCombustionProps) {
    const {sedes, loadSedes} = useSedeStore();
    const {tiposCombustible, loadTiposCombustible} = useTipoCombustibleStore();
    const {showCombustion, updateCombustion} = useCombustionStore();
    const {anios, loadAnios} = useAnioStore();
    const {meses, loadMeses} = useMesStore();

    const form = useForm<z.infer<typeof Combustion>>({
        resolver: zodResolver(Combustion),
        defaultValues: {
            sede: "",
            type_combustion: "",
            type_equipment: "",
            mes: "",
            anio: "",
            consumo: 0,
        },
    });

    async function loadForm(id: number) {
        try {
            const combustion: CombustionResource = await showCombustion(id);
            form.reset({
                sede: combustion.sede_id.toString(),
                type_combustion: combustion.tipoCombustible_id.toString(),
                type_equipment: combustion.tipoEquipo,
                mes: combustion.mes_id.toString(),
                anio: combustion.anio_id.toString(),
                consumo: combustion.consumo,
            });
        } catch (error) {
            console.error("Error loading combustion form:", error);
        }
    }

    useEffect(() => {
        loadSedes();
        loadTiposCombustible();
        loadMeses();
        loadAnios();
        loadForm(id);
    }, [loadSedes, loadTiposCombustible, loadMeses, id, loadAnios]);

    const onSubmit = async (data: z.infer<typeof Combustion>) => {
        const combustionRequest: CombustionRequest = {
            tipo,
            sede_id: Number(data.sede),
            tipoEquipo: data.type_equipment,
            tipoCombustible_id: Number(data.type_combustion),
            mes_id: Number(data.mes),
            anio_id: Number(data.anio),
            consumo: data.consumo,
        };
        await updateCombustion(id, combustionRequest);
        onClose();
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Sede</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
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

                        <FormField
                            control={form.control}
                            name="type_equipment"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Equipo</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Buses, Camiones, etc"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="type_combustion"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Tipo de Combustible</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tipo de combustible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposCombustible.map((tipo) => (
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
                            <FormField
                                name="mes"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Mes</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el mes"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {meses.map((mes) => (
                                                        <SelectItem key={mes.id} value={mes.id.toString()}>
                                                            {mes.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="anio"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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

                        <FormField
                            control={form.control}
                            name="consumo"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Consumo mensual</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            type="number"
                                            step="0.01"
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
