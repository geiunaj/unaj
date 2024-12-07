import React, {useEffect} from "react";
import {z} from "zod";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
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
import {getAnio, getTipoExtintor} from "@/components/anio/services/anio.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {getMes} from "@/components/mes/services/mes.actions";
import {CreateExtintorProps, ExtintorRequest} from "../service/extintor.interface";
import {createExtintor} from "../service/extintor.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {STEP_NUMBER} from "@/lib/constants/menu";

const Extintor = z.object({
    consumo: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    anio: z.string().min(1, "Seleccione un año"),
    sede: z.string().min(1, "Seleccione una sede"),
    mes: z.string().min(1, "Selecciona un Mes"),
    tipoExtintorId: z.string().min(1, "Seleccione un tipo de extintor"),
});

export function FormExtintor({onClose}: CreateExtintorProps) {
    const form = useForm<z.infer<typeof Extintor>>({
        resolver: zodResolver(Extintor),
        defaultValues: {
            consumo: 0,
            anio: "",
            sede: "",
            mes: "",
            tipoExtintorId: "",
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

    const tiposExtintor = useQuery({
        queryKey: ["tiposExtintorCreate"],
        queryFn: () => getTipoExtintor(),
        refetchOnWindowFocus: false,
    });

    const onSubmit = async (data: z.infer<typeof Extintor>) => {
        const ExtintorRequest: ExtintorRequest = {
            consumo: data.consumo,
            anio_id: Number(data.anio),
            sede_id: Number(data.sede),
            mes_id: Number(data.mes),
            tipoExtintorId: Number(data.tipoExtintorId),
            created_at: new Date(),
            updated_at: new Date(),
        };
        try {
            const response = await createExtintor(ExtintorRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (
        sedeQuery.isLoading ||
        anioQuery.isLoading ||
        mesQuery.isLoading ||
        tiposExtintor.isLoading ||
        sedeQuery.isError ||
        anioQuery.isError ||
        mesQuery.isError ||
        tiposExtintor.isError
    ) {
        return <SkeletonForm/>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name="sede"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="w-full">
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

                        <FormField
                            name="tipoExtintorId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Tipo de Extintor</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona el tipo"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {tiposExtintor.data!.map((tipoExtintor) => (
                                                    <SelectItem key={tipoExtintor.id}
                                                                value={tipoExtintor.id.toString()}>
                                                        {tipoExtintor.nombre}
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
                                <FormItem className="w-full">
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
                                <FormItem className="w-full">
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

                        {/* CONSUMO */}
                        <FormField
                            control={form.control}
                            name="consumo"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel> Consumo <span className="text-[10px]">[Kg]</span> </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Consumo"
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
        // </div>
    );
}
