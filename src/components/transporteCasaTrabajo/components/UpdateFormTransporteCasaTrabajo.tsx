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
import {
    TransporteCasaTrabajoRequest,
    UpdateTransporteCasaTrabajoProps,
} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.interface";
import {useQuery} from "@tanstack/react-query";
import {
    getTiposVehiculo
} from "@/components/tipoVehiculo/services/tipoVehiculo.actions";
import {updateTransporteCasaTrabajo} from "@/components/transporteCasaTrabajo/services/transporteCasaTrabajo.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    useAnio,
    useTransporteCasaTrabajoId,
    useSede
} from "@/components/transporteCasaTrabajo/lib/transporteCasaTrabajo.hook";
import {errorToast, parseNumber, successToast} from "@/lib/utils/core.function";
import {getMes} from "@/components/mes/services/mes.actions";
import { STEP_NUMBER } from "@/lib/constants/menu";

const TransporteCasaTrabajo = z.object({
    tipo: z.string().min(1, "Seleccione un tipo"),
    tipoVehiculoId: z.string().min(1, "Seleccione un tipo de Vehiculo"),
    kmRecorrido: z.preprocess(parseNumber, z.number({message: "Ingrese un número"}).min(0, "Ingresa un valor mayor a 0")),
    sede: z.string().min(1, "Seleccione una sede"),
    anio: z.string().min(1, "Seleccione un año"),
    mes: z.string().min(1, "Seleccione un mes"),
});

export function UpdateFormTransporteCasaTrabajo({
                                                    id, onClose,
                                                }: UpdateTransporteCasaTrabajoProps) {
    const form = useForm<z.infer<typeof TransporteCasaTrabajo>>({
        resolver: zodResolver(TransporteCasaTrabajo),
        defaultValues: {
            tipo: "",
            tipoVehiculoId: "",
            kmRecorrido: 0,
            sede: "",
            anio: "",
            mes: "1",
        },
    });

    // HOOKS
    const transporteCasaTrabajo = useTransporteCasaTrabajoId(id);
    const sedes = useSede();
    const anios = useAnio();
    const meses = useQuery({
        queryKey: ["mes"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });
    const tiposVehiculo = useQuery({
        queryKey: ['tipoVehiculoU'],
        queryFn: () => getTiposVehiculo(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (transporteCasaTrabajo.data) {
            const transporteCasaTrabajoData = await transporteCasaTrabajo.data;
            form.reset({
                tipo: transporteCasaTrabajoData.tipo,
                tipoVehiculoId: transporteCasaTrabajoData.tipoVehiculoId.toString(),
                kmRecorrido: transporteCasaTrabajoData.kmRecorrido,
                sede: transporteCasaTrabajoData.sedeId.toString(),
                anio: transporteCasaTrabajoData.anioId.toString(),
                mes: transporteCasaTrabajoData.mesId.toString(),
            });
        }
    }, [transporteCasaTrabajo.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof TransporteCasaTrabajo>) => {
        const transporteCasaTrabajoRequest: TransporteCasaTrabajoRequest = {
            tipoVehiculoId: parseInt(data.tipoVehiculoId),
            sedeId: parseInt(data.sede),
            anioId: parseInt(data.anio),
            mesId: parseInt(data.mes),
            kmRecorrido: data.kmRecorrido,
            tipo: data.tipo,
        };
        try {
            const response = await updateTransporteCasaTrabajo(id, transporteCasaTrabajoRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (transporteCasaTrabajo.isLoading || sedes.isLoading || anios.isLoading || tiposVehiculo.isLoading || meses.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center max-w-md">
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

                        {/* Tipo de Vehiculo */}
                        <FormField
                            name="tipoVehiculoId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Tipo de Vehiculo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo de Vehiculo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposVehiculo.data!.map((tipo) => (
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

                        {/* Tipo */}
                        <FormField
                            name="tipo"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Tipo</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el Tipo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="ALUMNO"> ALUMNO </SelectItem>
                                                <SelectItem value="DOCENTE"> DOCENTE </SelectItem>
                                                <SelectItem value="ADMINISTRATIVO"> ADMINISTRATIVO </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
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
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {meses.data!.map((anio) => (
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

                        {/* km Recorrido */}
                        <FormField
                            control={form.control}
                            name="kmRecorrido"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>km Recorrido</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="km Recorrido"
                                            type="number"
                                            step={STEP_NUMBER}
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
