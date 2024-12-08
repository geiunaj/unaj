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
import {getAnio} from "@/components/anio/services/anio.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {getMes} from "@/components/mes/services/mes.actions";
import {CreateTransporteAereoProps, TransporteAereoRequest} from "../service/transporteAereo.interface";
import {createTransporteAereo} from "../service/transporteAereo.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Switch} from "@/components/ui/switch";

const TransporteAereo = z.object({
    numeroPasajeros: z.preprocess(
        (val) => parseInt(val as string),
        z.number().min(1, "Ingresa un valor mayor a 0")
    ),
    origen: z.string().min(1, "Ingrese un lugar de salida"),
    destino: z.string().min(1, "Ingrese un lugar de destino"),
    isIdaVuelta: z.boolean(),
    fechaSalida: z.date().optional(),
    fechaRegreso: z.date().optional(),
    distanciaTramo: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    kmRecorrido: z.preprocess(
        (val) => parseFloat(val as string),
        z.number().min(0, "Ingresa un valor mayor a 0")
    ),
    anio: z.string().min(1, "Seleccione un año"),
    sede: z.string().min(1, "Seleccione una sede"),
    mes: z.string().min(1, "Selecciona un Mes"),
});

export function FormTransporteAereo({onClose}: CreateTransporteAereoProps) {
    const form = useForm<z.infer<typeof TransporteAereo>>({
        resolver: zodResolver(TransporteAereo),
        defaultValues: {
            numeroPasajeros: 0,
            origen: "",
            destino: "",
            isIdaVuelta: false,
            fechaSalida: undefined,
            fechaRegreso: undefined,
            distanciaTramo: 0,
            kmRecorrido: 0,
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

    const onSubmit = async (data: z.infer<typeof TransporteAereo>) => {
        const TransporteAereoRequest: TransporteAereoRequest = {
            numeroPasajeros: data.numeroPasajeros,
            origen: data.origen,
            destino: data.destino,
            isIdaVuelta: data.isIdaVuelta,
            fechaSalida: data.fechaSalida?.toString(),
            fechaRegreso: data.fechaRegreso?.toString(),
            distanciaTramo: data.distanciaTramo,
            kmRecorrido: data.kmRecorrido,
            anio_id: Number(data.anio),
            sede_id: Number(data.sede),
            mes_id: Number(data.mes),
            created_at: new Date(),
            updated_at: new Date(),
        };
        try {
            const response = await createTransporteAereo(TransporteAereoRequest);
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
                        className="w-full flex flex-col gap-3 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/* Sede */}
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

                        <div className="flex gap-5">
                            {/* ORDEN DE SERVICIO */}
                            <FormField
                                control={form.control}
                                name="numeroPasajeros"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel> Orden de Servicio </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Número de pasajeros"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* Ida y Vuelta */}
                            <FormField
                                control={form.control}
                                name="isIdaVuelta"
                                render={({field}) => (
                                    <FormItem
                                        className="w-1/2">
                                        <FormLabel className="text-sm">
                                            Ida y Vuelta
                                        </FormLabel>
                                        <div
                                            className="flex flex-row items-center justify-between p-[7px] rounded border">
                                            <FormDescription>
                                                ¿Es de Ida y Vuelta?
                                            </FormDescription>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        if (form.getValues("distanciaTramo") === 0) {
                                                            form.setValue("kmRecorrido", 0);
                                                        } else {
                                                            if (checked) {
                                                                form.setValue("kmRecorrido", form.getValues("distanciaTramo") * 2);
                                                            } else {
                                                                form.setValue("kmRecorrido", form.getValues("distanciaTramo"));
                                                            }
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </div>

                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-5">
                            {/* Anio */}
                            <FormField
                                name="anio"
                                control={form.control}
                                render={({field}) => (
                                    <FormItem className="w-1/2">
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
                                    <FormItem className="w-1/2">
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

                        <div className="flex gap-5">
                            {/* DISTANCIA TRAMO */}
                            <FormField
                                control={form.control}
                                name="distanciaTramo"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel> Distancia Tramo [km] </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                placeholder="Número de pasajeros"
                                                onChange={(e) => {
                                                    const newValue = e.target.valueAsNumber;
                                                    field.onChange(newValue);
                                                    if (form.getValues("isIdaVuelta") === true) {
                                                        form.setValue("kmRecorrido", newValue * 2);
                                                    } else {
                                                        form.setValue("kmRecorrido", newValue);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* km */}
                            <FormField
                                control={form.control}
                                name="kmRecorrido"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>
                                            km Recorridos
                                        </FormLabel>
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
                        </div>

                        <div className="flex gap-5">
                            {/* ORIGEN */}
                            <FormField
                                control={form.control}
                                name="origen"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
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
                            {/* DESTINO */}
                            <FormField
                                control={form.control}
                                name="destino"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
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
                        <div className="flex gap-5">
                            {/* FECHA SALIDA */}
                            <FormField
                                control={form.control}
                                name="fechaSalida"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Fecha Salida</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Seleccione fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* FECHA SALIDA */}
                            <FormField
                                control={form.control}
                                name="fechaRegreso"
                                render={({field}) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Fecha Regreso</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Seleccione fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
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
        // </div>
    );
}
