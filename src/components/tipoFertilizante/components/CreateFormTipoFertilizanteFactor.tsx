import React, { useEffect } from "react";
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

import { useQuery } from "@tanstack/react-query";
import {
  getAnio,
  getTipoExtintor,
} from "@/components/anio/services/anio.actions";
import { errorToast, successToast } from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import { createTipoFertilizanteFactor } from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.actions";
import {
  CreateFertilizanteFactorProps,
  FertilizanteFactorRequest,
} from "@/components/tipoFertilizante/services/tipoFertilizanteFactor.interface";
import { STEP_NUMBER } from "@/lib/constants/menu";
import { getTiposFertilizante } from "../services/tipoFertilizante.actions";
import {
  TipoFertilizante,
  TipoFertilizanteCollection,
} from "../services/tipoFertilizante.interface";

const TipoFertilizanteFactor = z.object({
  tipoFertilizanteId: z.string().min(1, "Seleciona el tipo de fertilizante"),
  anio: z.string().min(1, "Seleciona el año"),
  factor: z.preprocess(
    (val) => parseFloat(val as string),
    z
      .number({ message: "Ingresa un valor numerico" })
      .min(0, "Ingresa un valor mayor a 0")
  ),
  fuente: z.string().optional(),
  link: z.string().optional(),
});

export function CreateFormTipoFertilizanteFactor({
  onClose,
}: CreateFertilizanteFactorProps) {
  const form = useForm<z.infer<typeof TipoFertilizanteFactor>>({
    resolver: zodResolver(TipoFertilizanteFactor),
    defaultValues: {
      tipoFertilizanteId: "",
      anio: "",
      factor: 0,
      fuente: "",
      link: "",
    },
  });

  const [tipoFertilizanteSelected, setTipoFertilizanteSelected] =
    React.useState<TipoFertilizanteCollection | null>(null);

  const anios = useQuery({
    queryKey: ["anio"],
    queryFn: () => getAnio(),
    refetchOnWindowFocus: false,
  });

  const tiposFertilizante = useQuery({
    queryKey: ["tipoFertilizante"],
    queryFn: () => getTiposFertilizante(),
    refetchOnWindowFocus: false,
  });

  const onSubmit = async (data: z.infer<typeof TipoFertilizanteFactor>) => {
    const TipoFertilizanteFactorRequest: FertilizanteFactorRequest = {
      tipoFertilizanteId: parseInt(data.tipoFertilizanteId),
      anio_id: parseInt(data.anio),
      valor: data.factor,
      fuente: data.fuente,
      link: data.link,
    };

    try {
      await createTipoFertilizanteFactor(TipoFertilizanteFactorRequest);
      onClose();
      successToast("Factor de Extintor creado correctamente");
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

  if (anios.isLoading || tiposFertilizante.isLoading) {
    return <SkeletonForm />;
  }

  if (anios.isError || tiposFertilizante.isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="tipoFertilizanteId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Tipo de Fertilizante</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedFertilizante = tiposFertilizante.data!.find(
                        (tipo) => tipo.id.toString() === value
                      );
                      setTipoFertilizanteSelected(selectedFertilizante || null);
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tiposFertilizante.data!.map((tipoFertilizante) => (
                          <SelectItem
                            key={tipoFertilizante.id}
                            value={tipoFertilizante.id.toString()}
                          >
                            {tipoFertilizante.nombre}
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
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Año</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona el año" />
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

            <FormField
              control={form.control}
              name="factor"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>
                    Factor <span className="text-[9px]">[kgCO2/{tipoFertilizanteSelected?.unidad}]</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Factor"
                      step={STEP_NUMBER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*FUENTE*/}
            <FormField
              control={form.control}
              name="fuente"
              render={({ field }) => (
                <FormItem className="pt-2 w-full">
                  <FormLabel>Fuente</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Fuente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*LINK*/}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="pt-2 w-full">
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
