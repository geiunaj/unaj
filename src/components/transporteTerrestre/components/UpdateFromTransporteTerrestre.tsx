import React, { useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import { useTransporteTerrestreId } from "../lib/transporteTerrestre.hook";
import { successToast } from "@/lib/utils/core.function";
import { updateTransporteTerrestre } from "../service/transporteTerrestre.actions";
import {
  TransporteTerrestreRequest,
  UpdateTransporteTerrestreProps,
} from "../service/transporteTerrestre.interface";
import { useQuery } from "@tanstack/react-query";
import { getSedes } from "@/components/sede/services/sede.actions";
import { getMes } from "@/components/mes/services/mes.actions";
import { getAnio } from "@/components/anio/services/anio.actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const TransporteTerrestreSchema = z.object({
  numeroPasajeros: z.preprocess(
    (val) => parseInt(val as string),
    z.number().min(1, "Ingresa un valor mayor a 0")
  ),
  origen: z.string().min(1, "Ingrese un lugar de salida"),
  destino: z.string().min(1, "Ingrese un lugar de destino"),
  isIdaVuelta: z.boolean(),
  fechaSalida: z.string().optional(),
  fechaRegreso: z.string().optional(),
  distanciaTramo: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
  anio: z.string().min(1, "Seleccione un año"),
  sede: z.string().min(1, "Seleccione una sede"),
  mes: z.string().min(1, "Selecciona un Mes"),
});

export function UpdateFormTransporteTerrestre({
  id,
  onClose,
}: UpdateTransporteTerrestreProps) {
  const form = useForm<z.infer<typeof TransporteTerrestreSchema>>({
    resolver: zodResolver(TransporteTerrestreSchema),
    defaultValues: {
      numeroPasajeros: 0,
      origen: "",
      destino: "",
      isIdaVuelta: false,
      fechaSalida: undefined,
      fechaRegreso: undefined,
      distanciaTramo: 0,
      anio: "",
      sede: "",
      mes: "",
    },
  });

  const transporteTerrestres = useTransporteTerrestreId(id);
  const sedeQuery = useQuery({
    queryKey: ["sedesUTA"],
    queryFn: () => getSedes(),
    refetchOnWindowFocus: false,
  });

  const mesQuery = useQuery({
    queryKey: ["mesesUTA"],
    queryFn: () => getMes(),
    refetchOnWindowFocus: false,
  });

  const anioQuery = useQuery({
    queryKey: ["aniosUTA"],
    queryFn: () => getAnio(),
    refetchOnWindowFocus: false,
  });

  const loadForm = useCallback(async () => {
    if (transporteTerrestres.data) {
      const transporteTerrestre = await transporteTerrestres.data;
      form.reset({
        numeroPasajeros: transporteTerrestre.numeroPasajeros ?? 0,
        origen: transporteTerrestre.origen,
        destino: transporteTerrestre.destino,
        isIdaVuelta: transporteTerrestre.isIdaVuelta,
        fechaSalida: transporteTerrestre.fechaSalida ?? undefined,
        fechaRegreso: transporteTerrestre.fechaRegreso ?? undefined,
        distanciaTramo: transporteTerrestre.distancia ?? undefined,
        anio: transporteTerrestre.anio_id.toString(),
        sede: transporteTerrestre.sede_id.toString(),
        mes: transporteTerrestre.mes_id.toString(),
      });
    }
  }, [transporteTerrestres.data, form]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const onSubmit = async (data: z.infer<typeof TransporteTerrestreSchema>) => {
    const TransporteTerrestreRequest: TransporteTerrestreRequest = {
      numeroPasajeros: data.numeroPasajeros,
      origen: data.origen,
      destino: data.destino,
      isIdaVuelta: data.isIdaVuelta,
      fechaSalida: data.fechaSalida?.toString(),
      fechaRegreso: data.fechaRegreso?.toString(),
      distancia: data.distanciaTramo,
      motivo: "",
      numeroComprobante: "",
      anio_id: Number(data.anio),
      sede_id: Number(data.sede),
      mes_id: Number(data.mes),
      created_at: new Date(),
      updated_at: new Date(),
    };
    try {
      const response = await updateTransporteTerrestre(
        id,
        TransporteTerrestreRequest
      );
      onClose();
      successToast(response.data.message);
    } catch (error: any) {}
  };

  if (
    transporteTerrestres.isLoading ||
    sedeQuery.isFetching ||
    anioQuery.isFetching ||
    mesQuery.isFetching ||
    sedeQuery.isError ||
    anioQuery.isError ||
    mesQuery.isError
  ) {
    return <SkeletonForm />;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-3 pt-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex gap-5">
              {/* Sede */}
              <FormField
                name="sede"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Sede</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleciona tu sede" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectGroup>
                          {sedeQuery.data!.map((sede) => (
                            <SelectItem
                              key={sede.id}
                              value={sede.id.toString()}
                            >
                              {sede.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* NUMERO PASAJEROSS */}
              <FormField
                control={form.control}
                name="numeroPasajeros"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel> Número de Pasajeros </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Número de pasajeros"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5">
              {/* Anio */}
              <FormField
                name="anio"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Año</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
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
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Mes</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
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
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel> Distancia Tramo </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Número de pasajeros"
                        step={0.001}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5">
              {/* ORIGEN */}
              <FormField
                control={form.control}
                name="origen"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* DESTINO */}
              <FormField
                control={form.control}
                name="destino"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5">
              {/* FECHA SALIDA */}
              <FormField
                control={form.control}
                name="fechaSalida"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Fecha Salida</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="01-01-2000" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* FECHA SALIDA */}
              <FormField
                control={form.control}
                name="fechaRegreso"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Fecha Regreso</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="01-01-2000" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
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
  );
}
