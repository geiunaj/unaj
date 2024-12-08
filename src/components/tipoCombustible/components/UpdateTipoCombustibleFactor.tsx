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

import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";

import SkeletonForm from "@/components/Layout/skeletonForm";
import {
    CreateTipoCombustibleProps, TipoCombustibleCollection,
    TipoCombustibleRequest,
} from "../services/tipoCombustible.interface";
import {createTipoCombustible, getTiposCombustible} from "../services/tipoCombustible.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {
    TipoCombustibleFactorRequest,
    UpdateTipoCombustibleFactorProps
} from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";
import {
    createTipoCombustibleFactor,
    showTipoCombustibleFactor, updateTipoCombustibleFactor
} from "@/components/tipoCombustible/services/tipoCombustibleFactor.actions";
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getAnio} from "@/components/anio/services/anio.actions";

const TipoCombustibleFactor = z.object({
    tipo: z.string().min(1, "Selecciona un tipo de combustible"),
    tipoConsumibleId: z.string().min(1, "Selecciona un tipo de consumible"),
    factorEmisionCO2: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorEmisionCH4: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    factorEmisionN2O: z.preprocess((val) => parseFloat(val as string,),
        z.number().min(0, "Ingresa un valor mayor a 0")),
    anio_id: z.string().min(1, "Selecciona un año"),
    fuente: z.string().min(1, "Ingrese una fuente"),
    link: z.string().optional(),
});

export function UpdateTipoCombustibleFactor({onClose, id}: UpdateTipoCombustibleFactorProps) {
    const form = useForm<z.infer<typeof TipoCombustibleFactor>>({
        resolver: zodResolver(TipoCombustibleFactor),
        defaultValues: {
            tipo: "",
            tipoConsumibleId: "",
            factorEmisionCO2: 0,
            factorEmisionCH4: 0,
            factorEmisionN2O: 0,
            anio_id: "",
            fuente: "",
            link: "",
        },
    });

    const [tipoCombustibleSelected, setTipoCombustibleSelected] = useState<TipoCombustibleCollection | null>(null);

    const tipoCombustibleFactor = useQuery({
        queryKey: ["tipoCombustibleFactorU"],
        queryFn: () => showTipoCombustibleFactor(id),
        refetchOnWindowFocus: false,
    });

    const tipoCombustibles = useQuery({
        queryKey: ["tiposCombustibleUF"],
        queryFn: () => getTiposCombustible(),
        refetchOnWindowFocus: false,
    })

    const anios = useQuery({
        queryKey: ["aniosUF"],
        queryFn: () => getAnio(),
        refetchOnWindowFocus: false
    });

    const loadForm = useCallback(async () => {
        if (tipoCombustibleFactor.data) {
            const tipoCombustibleFactorData = await tipoCombustibleFactor.data;
            console.log(tipoCombustibleFactorData);
            form.reset({
                tipo: tipoCombustibleFactorData.tipo,
                tipoConsumibleId: tipoCombustibleFactorData.tipoCombustible_id.toString(),
                factorEmisionCO2: tipoCombustibleFactorData.factorEmisionCO2,
                factorEmisionCH4: tipoCombustibleFactorData.factorEmisionCH4,
                factorEmisionN2O: tipoCombustibleFactorData.factorEmisionN2O,
                anio_id: tipoCombustibleFactorData.anio_id.toString(),
                fuente: tipoCombustibleFactorData.fuente,
                link: tipoCombustibleFactorData.link,
            });
        }
    }, [tipoCombustibleFactor.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm]);

    const onSubmit = async (data: z.infer<typeof TipoCombustibleFactor>) => {
        const tipoCombustibleFactorRequest: TipoCombustibleFactorRequest = {
            tipo: data.tipo,
            tipoCombustible_id: parseInt(data.tipoConsumibleId),
            factorEmisionCO2: data.factorEmisionCO2,
            factorEmisionCH4: data.factorEmisionCH4,
            factorEmisionN2O: data.factorEmisionN2O,
            anio_id: parseInt(data.anio_id),
            fuente: data.fuente,
            link: data.link,
        };
        try {
            const response = await updateTipoCombustibleFactor(id, tipoCombustibleFactorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            console.error(error);
            errorToast(error.response?.data);
        }
    };

    if (tipoCombustibleFactor.isLoading || tipoCombustibles.isLoading || anios.isLoading) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Tipo */}
                        <FormField
                            name="tipo"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Tipo de Combustible</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="estacionaria">Estacionaria</SelectItem>
                                                <SelectItem value="movil">Móvil</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        {/* Tipo de Consumible */}
                        <FormField
                            name="tipoConsumibleId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Nombre de Consumible</FormLabel>
                                    <Select onValueChange={(value) => {
                                        const selectedCombustible = tipoCombustibles.data!.find(tipo => tipo.id.toString() === value);
                                        setTipoCombustibleSelected(selectedCombustible || null);
                                        field.onChange(value);
                                    }}
                                            value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Nombre de Consumible"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tipoCombustibles.data!.map((tipo) => (
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

                        <div className="flex gap-5">
                            {/* CO2 */}
                            <FormField
                                control={form.control}
                                name="factorEmisionCO2"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor CO2 <span
                                            className="text-xs">[kg GEI /{tipoCombustibleSelected?.unidad}]</span>
                                        </FormLabel>
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

                            {/* CH4 */}
                            <FormField
                                control={form.control}
                                name="factorEmisionCH4"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>
                                            Factor CH4 <span
                                            className="text-xs">[kg GEI /{tipoCombustibleSelected?.unidad}]</span>
                                        </FormLabel>
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

                        </div>

                        <div className="flex gap-5">
                            {/* N2O */}
                            <FormField
                                control={form.control}
                                name="factorEmisionN2O"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Factor N2O <span
                                            className="text-xs">[kg GEI /{tipoCombustibleSelected?.unidad}]</span>
                                        </FormLabel>
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

                            {/* Año */}
                            <FormField
                                control={form.control}
                                name="anio_id"
                                render={({field}) => (
                                    <FormItem className="pt-2 w-1/2">
                                        <FormLabel>Año</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
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

                        {/*FUENTE*/}
                        <FormField
                            control={form.control}
                            name="fuente"
                            render={({field}) => (
                                <FormItem className=" w-full">
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
                                <FormItem className=" w-full">
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
