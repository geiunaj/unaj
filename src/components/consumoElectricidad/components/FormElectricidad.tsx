import React, {useEffect, useState} from "react";
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

import {useSedeStore} from "@/components/sede/lib/sede.store";
import {useAnioStore} from "@/components/anio/lib/anio.store";
import {useMesStore} from "@/components/mes/lib/mes.stores";
import {useElectricidadStore} from "../lib/electricidad.store";
import {
    CreateElectricidadProps,
    electricidadRequest,
} from "../services/electricidad.interface";

const Electricidad = z.object({
    area: z.string().min(1, "Seleccione un área"),
    numero_suministro: z.string().min(1, "Ingrese un número de suministro"),
    mes: z.string().min(1, "Seleccione un mes"),
    sede: z.string().min(1, "Seleccione una sede"),
    anio: z.string().min(1, "Seleccione un año"),
    cantidad: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
});

export function FormElectricidad({onClose}: CreateElectricidadProps) {
    const {sedes, loadSedes} = useSedeStore();
    const {anios, loadAnios} = useAnioStore();
    const {meses, loadMeses} = useMesStore();
    const {createElectricidad} = useElectricidadStore();

    const [clases, setClases] = useState<string[]>([]);

    const form = useForm<z.infer<typeof Electricidad>>({
        resolver: zodResolver(Electricidad),
        defaultValues: {
            area: "",
            numero_suministro: "",
            mes: "",
            sede: "",
            cantidad: 0,
            anio: "",
        },
    });

    const {watch, setValue} = form;

    useEffect(() => {
        loadSedes();
        loadAnios();
        loadMeses();
    }, [loadSedes, loadMeses, loadAnios]);

    const onSubmit = async (data: z.infer<typeof Electricidad>) => {
        const ElectricidadRequest: electricidadRequest = {
            area_id: parseInt(data.area),
            numeroSuministro: data.numero_suministro,
            mes_id: parseInt(data.mes),
            consumo: data.cantidad,
            sede_id: parseInt(data.sede),
            anio_id: parseInt(data.anio),
        };
        console.log(ElectricidadRequest);
        await createElectricidad(ElectricidadRequest);
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
                                        defaultValue={field.value}
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

                        {/* Area */}
                        <FormField
                            name="area"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Area</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona tu area"/>
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

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="numero_suministro"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Número de Suministro</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="1234567"
                                                type="text"
                                                maxLength={8}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Cantidad */}
                            <FormField
                                control={form.control}
                                name="cantidad"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Consumo</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="kw/h"
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
                            {/* Mes */}
                            <FormField
                                control={form.control}
                                name="mes"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Mes</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
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
