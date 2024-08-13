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
import {CreateTipoPapelProps, TipoPapelRequest} from "@/components/tipoPapel/services/tipoPapel.interface";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {createTipoPapel} from "@/components/tipoPapel/services/tipoPapel.actions";

const TipoPapel = z.object({
    nombre: z.string().min(1, "Ingrese un nombre"),
    gramaje: z.number().min(0, "Ingresa un valor mayor a 0"),
    unidad_paquete: z.string().min(1, "Ingrese una unidad"),
    is_certificado: z.boolean().optional(),
    is_reciclable: z.boolean().optional(),
    porcentaje_reciclado: z.preprocess((val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")).optional(),
    nombre_certificado: z.string().optional(),
});

export function FromTipoCombustible({onClose}: CreateTipoPapelProps) {
    const form = useForm<z.infer<typeof TipoPapel>>({
        resolver: zodResolver(TipoPapel),
        defaultValues: {
            nombre: "",
            gramaje: 0,
            unidad_paquete: "",
            is_certificado: false,
            is_reciclable: false,
            porcentaje_reciclado: 0,
            nombre_certificado: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof TipoPapel>) => {
        const tipoPapelRequest: TipoPapelRequest = {
            nombre: data.nombre,
            gramaje: data.gramaje,
            unidad_paquete: data.unidad_paquete,
            is_certificado: data.is_certificado,
            is_reciclable: data.is_reciclable,
            porcentaje_reciclado: data.porcentaje_reciclado,
            nombre_certificado: data.nombre_certificado,
        };
        await createTipoPapel(tipoPapelRequest);
        onClose();
    };

    if (false) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2 "
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Nombre */}
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
                                            placeholder="Gasolina, Diesel, etc."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-5">
                            <FormField
                                control={form.control}
                                name="gramaje"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
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

                            {/* Unidad */}
                            <FormField
                                control={form.control}
                                name="unidad_paquete"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Unidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="L,m3, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-5">
                            {/* valorCalorico */}
                            <FormField
                                control={form.control}
                                name="valorCalorico"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Valor Calorico</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="GAS, DIE, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* factorEmisionCO2 */}
                            <FormField
                                control={form.control}
                                name="factorEmisionCO2"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor de Emisión CO2</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="Litros, Galones, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-5">
                            {/* factorEmisionCH4 */}
                            <FormField
                                control={form.control}
                                name="factorEmisionCH4"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Valor Calorico</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="GAS, DIE, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* factorEmisionN2O */}
                            <FormField
                                control={form.control}
                                name="factorEmisionN2O"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor de Emisión CO2</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                // placeholder="Litros, Galones, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
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
