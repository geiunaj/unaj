import React, { useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import SkeletonForm from "@/components/Layout/skeletonForm";
import { useTaxiId } from "../lib/taxi.hook";
import { successToast } from "@/lib/utils/core.function";
import {
  useAnio,
  useMes,
  useSede,
} from "@/components/combustion/lib/combustion.hook";
import { updateTaxi } from "../service/taxi.actions";
import { TaxiRequest, UpdateTaxiProps } from "../service/taxi.interface";

const TaxiSchema = z.object({
  unidadContratante: z.string().min(1, "Seleccione un tipo de hoja"),
  lugarSalida: z.string().min(1, "Seleccione un tipo de hoja"),
  lugarDestino: z.string().min(1, "Seleccione un tipo de hoja"),
  montoGastado: z.preprocess(
    (val) => parseInt(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
  anio: z.string().min(1, "Seleccione un año"),
  sede: z.string().min(1, "Seleccione una sede"),
  mes: z.string().min(1, "Selecciona un Mes"),
});

export function UpdateFormTaxi({ id, onClose }: UpdateTaxiProps) {
  const form = useForm<z.infer<typeof TaxiSchema>>({
    resolver: zodResolver(TaxiSchema),
    defaultValues: {
      unidadContratante: "",
      lugarSalida: "",
      lugarDestino: "",
      montoGastado: 0,
      anio: "",
      sede: "",
      mes: "",
    },
  });

  const taxis = useTaxiId(id);
  const sedes = useSede();
  const anios = useAnio();
  const meses = useMes();

  const loadForm = useCallback(() => {
    if (taxis.data) {
      console.log(taxis.data);
      form.reset({
        unidadContratante: taxis.data.unidadContratante,
        lugarSalida: taxis.data.lugarSalida,
        lugarDestino: taxis.data.lugarDestino,
        montoGastado: taxis.data.montoGastado,
        sede: taxis.data.sede.id.toString(),
        anio: taxis.data.anio.id.toString(),
        mes: taxis.data.mes.id.toString(),
      });
    }
  }, [taxis.data, form]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const onSubmit = async (data: z.infer<typeof TaxiSchema>) => {
    const TaxiRequest: TaxiRequest = {
      unidadContratante: data.unidadContratante,
      lugarSalida: data.lugarSalida,
      lugarDestino: data.lugarDestino,
      montoGastado: data.montoGastado,
      anio_id: Number(data.anio),
      sede_id: Number(data.sede),
      mes_id: Number(data.mes),
      created_at: new Date(),
      updated_at: new Date(),
    };
    try {
      const response = await updateTaxi(id, TaxiRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  if (
    sedes.isFetching ||
    anios.isFetching ||
    meses.isFetching ||
    sedes.isError ||
    anios.isError ||
    meses.isError
  ) {
    return <SkeletonForm />;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-3 pt-2 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Sede */}
            <FormField
              name="sede"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Sede</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu sede" />
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
            <div className="flex gap-5">
              {/* Anio */}
              <FormField
                control={form.control}
                name="anio"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Año</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      // defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el año" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {anios.data!.map((anio) => (
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
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Mes</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      // defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el mes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {meses.data!.map((mes) => (
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
              {/* Unidad contratante */}
              <FormField
                control={form.control}
                name="unidadContratante"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Unidad Contratante</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Unidad contratante"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Monto */}
              <FormField
                control={form.control}
                name="montoGastado"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Ingresa el monto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5">
              {/* lugar_salida */}
              <FormField
                control={form.control}
                name="lugarSalida"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* lugar_destino */}
              <FormField
                control={form.control}
                name="lugarDestino"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Button */}
            <div className="w-full flex justify-center items-center pt-6">
              <Button className="w-full" type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
