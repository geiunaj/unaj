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
import {ConsumoPapelRequest, CreateConsumoPapelProps} from "../services/consumoPapel.interface";
import {createConsumoPapel} from "../services/consumoPapel.actions";
import {Textarea} from "../../ui/textarea";
import {useQuery} from "@tanstack/react-query";
import {getSedes} from "@/components/sede/services/sede.actions";
import {getTiposPapel} from "@/components/tipoPapel/services/tipoPapel.actions";
import {getAnio} from "@/components/anio/services/anio.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";

const ConsumoPapel = z.object({
    type_hoja: z.string().min(1, "Seleccione un tipo de hoja"),
    quantity_packaging: z.preprocess((val) => parseInt(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    comentary: z.string().optional(),
    anio: z.string().min(1, "Seleccione un año"),
    sede: z.string().min(1, "Seleccione una sede"),
});

export function FormPapel({onClose}: CreateConsumoPapelProps) {
    const form = useForm<z.infer<typeof ConsumoPapel>>({
        resolver: zodResolver(ConsumoPapel),
        defaultValues: {
            type_hoja: "",
            quantity_packaging: 0,
            comentary: "",
            anio: "",
            sede: "",
        },
    });

    const sedeQuery = useQuery({
        queryKey: ['sedesCPO'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const tipoPapelQuery = useQuery({
        queryKey: ['tiposPapelCPO'],
        queryFn: () => getTiposPapel(),
        refetchOnWindowFocus: false,
    });

    const anioQuery = useQuery({
        queryKey: ['aniosCPO'],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof ConsumoPapel>) => {
        const consumoPapelRequest: ConsumoPapelRequest = {
            tipoPapel_id: Number(data.type_hoja),
            cantidad_paquete: data.quantity_packaging,
            sede_id: Number(data.sede),
            anio_id: Number(data.anio),
            comentario: data.comentary,
        };
        console.log(consumoPapelRequest);
        await createConsumoPapel(consumoPapelRequest);
        onClose();
    };

    if (sedeQuery.isFetching || tipoPapelQuery.isFetching || anioQuery.isFetching
        || sedeQuery.isError || tipoPapelQuery.isError || anioQuery.isError) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form className="w-full flex flex-col gap-3 pt-2 "
                          onSubmit={form.handleSubmit(onSubmit)}>

                        {/* Sede */}
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
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
                        {/* Tipo de hoja */}
                        <FormField
                            name="type_hoja"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Tipo de hoja</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Papel - Unidad - % Reciclado - Certificado"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tipoPapelQuery.data!.map((tipoPapel) => (
                                                    <SelectItem
                                                        key={tipoPapel.id}
                                                        value={tipoPapel.id.toString()}
                                                    >
                                                        {tipoPapel.nombre} - {tipoPapel.gramaje} gr -{" "}
                                                        {tipoPapel.unidad_paquete}
                                                        {tipoPapel.porcentaje_reciclado !== undefined &&
                                                            tipoPapel.porcentaje_reciclado > 0 && (
                                                                <>- {tipoPapel.porcentaje_reciclado}%</>
                                                            )}
                                                        {tipoPapel.nombre_certificado && (
                                                            <>- {tipoPapel.nombre_certificado}</>
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            {/* quantity_packaging */}
                            <FormField
                                control={form.control}
                                name="quantity_packaging"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Cantidad de empaques</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Unidad/año"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* año */}
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
                        </div>
                        {/* Comentario */}
                        <FormField
                            control={form.control}
                            name="comentary"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Comentario</FormLabel>
                                    <FormControl className="w-full">
                                        <Textarea
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Comentario"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" className="w-full">
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
