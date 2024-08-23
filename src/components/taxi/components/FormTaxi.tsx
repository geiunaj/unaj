import React, {useEffect} from "react";
import {z} from "zod";
import {useForm, Controller} from "react-hook-form";
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
import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {getMes} from "@/components/mes/services/mes.actions";
import {CreateTaxiProps, TaxiRequest} from "../service/taxi.interface";
import {createTaxi} from "../service/taxi.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";

const Taxi = z.object({
    unidad_contratante: z.string().min(1, "Seleccione un tipo de hoja"),
    lugar_salida: z.string().min(1, "Seleccione un tipo de hoja"),
    lugar_destino: z.string().min(1, "Seleccione un tipo de hoja"),
    monto: z.preprocess(
        (val) => parseInt(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    anio: z.string().min(1, "Seleccione un año"),
    sede: z.string().min(1, "Seleccione una sede"),
    mes: z.string().min(1, "Selecciona un Mes"),
});

export function FormTaxi({onClose}: CreateTaxiProps) {
    const form = useForm<z.infer<typeof Taxi>>({
        resolver: zodResolver(Taxi),
        defaultValues: {
            unidad_contratante: "",
            lugar_salida: "",
            lugar_destino: "",
            monto: 0,
            anio: "",
            sede: "",
            mes: "",
        },
    });

    const sedeQuery = useQuery({
        queryKey: ["sedes"],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const mesQuery = useQuery({
        queryKey: ["meses"],
        queryFn: () => getMes(),
        refetchOnWindowFocus: false,
    });

    const anioQuery = useQuery({
        queryKey: ["anios"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof Taxi>) => {
        const TaxiRequest: TaxiRequest = {
            unidadContratante: data.unidad_contratante,
            lugarSalida: data.lugar_salida,
            lugarDestino: data.lugar_destino,
            monto: data.monto,
            anio_id: Number(data.anio),
            sede_id: Number(data.sede),
            mes_id: Number(data.mes),
            created_at: new Date(),
            updated_at: new Date(),
        };
        try {
            const response = await createTaxi(TaxiRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (
        sedeQuery.isFetching ||
        anioQuery.isFetching ||
        mesQuery.isFetching ||
        sedeQuery.isError ||
        anioQuery.isError ||
        mesQuery.isError
    ) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-2 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Sede */}
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Sede</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona tu sede"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {sedeQuery.data!.map((sede) => (
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
                        <div className="flex gap-5">
                            {/* Anio */}
                            <FormField
                                name="anio"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Año"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {anioQuery.data!.map((anio) => (
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

                            {/* Mes */}
                            <FormField
                                name="mes"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Mes</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Mes"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage/>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {mesQuery.data!.map((mes) => (
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
                        </div>

                        {/* Unidad contratante */}
                        <FormField
                            control={form.control}
                            name="unidad_contratante"
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Unidad Contratante</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Unidad contratante"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            {/* lugar_salida */}
                            <FormField
                                control={form.control}
                                name="lugar_salida"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Lugar de Salida</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Lugar de salida"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* lugar_destino */}
                            <FormField
                                control={form.control}
                                name="lugar_destino"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Lugar de Destino</FormLabel>

                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Lugar de destino"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* monto */}
                        <FormField
                            control={form.control}
                            name="monto"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Monto</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="S/10.0"
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
        // </div>
    );
}
