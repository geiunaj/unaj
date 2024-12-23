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

import { useQuery } from "@tanstack/react-query";
import { errorToast, successToast } from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
  UpdateFertilizanteFactorProps,
  FertilizanteFactorRequest,
} from "../services/tipoFertilizanteFactor.interface";
import {
  getAnio,
  getTipoExtintor,
} from "@/components/anio/services/anio.actions";
import {
  showTipoFertilizanteFactor,
  updateTipoFertilizanteFactor,
} from "../services/tipoFertilizanteFactor.actions";
import { TipoFertilizanteCollection } from "../services/tipoFertilizante.interface";
import { getTiposFertilizante } from "../services/tipoFertilizante.actions";

const UpdateTipoFertilizanteFactor = z.object({
  tipoFertilizanteId: z.string().min(1, "Seleciona el tipo de fertilizante"),
  anio: z.string().min(1, "Selecciona un año"),
  factor: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
  fuente: z.string().optional(),
  link: z.string().optional(),
});

export function UpdateFormTipoFertilizanteFactor({
  id,
  onClose,
}: UpdateFertilizanteFactorProps) {
  const form = useForm<z.infer<typeof UpdateTipoFertilizanteFactor>>({
    resolver: zodResolver(UpdateTipoFertilizanteFactor),
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

  const tiposFertilizante = useQuery({
    queryKey: ["tipoFertilizante"],
    queryFn: () => getTiposFertilizante(),
    refetchOnWindowFocus: false,
  });

  const anios = useQuery({
    queryKey: ["anioUEFX"],
    queryFn: () => getAnio(),
    refetchOnWindowFocus: false,
  });

  const tipoFertilizanteFactor = useQuery({
    queryKey: ["tipoFertilizanteFactor"],
    queryFn: () => showTipoFertilizanteFactor(id),
    refetchOnWindowFocus: false,
  });

  const loadForm = useCallback(async () => {
    if (tipoFertilizanteFactor.data) {
      const factorData = await tipoFertilizanteFactor.data;
      form.reset({
        tipoFertilizanteId: factorData.tipoFertilizanteId.toString(),
        anio: factorData.anio_id.toString(),
        factor: factorData.valor,
        fuente: factorData.fuente ?? "",
        link: factorData.link ?? "",
      });
      setTipoFertilizanteSelected(
        tiposFertilizante.data!.find(
          (tipo) => tipo.id === factorData.tipoFertilizanteId
        ) || null
      );
    }
  }, [tipoFertilizanteFactor.data, form]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const onSubmit = async (
    data: z.infer<typeof UpdateTipoFertilizanteFactor>
  ) => {
    const tipoFertilizanteFactorRequest: FertilizanteFactorRequest = {
      tipoFertilizanteId: parseInt(data.tipoFertilizanteId),
      anio_id: parseInt(data.anio),
      valor: data.factor,
      fuente: data.fuente,
      link: data.link,
    };

    try {
      const response = await updateTipoFertilizanteFactor(
        id,
        tipoFertilizanteFactorRequest
      );
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(
        error.response?.data?.message || "Error actualizando factor de emisión"
      );
    }
  };

  if (anios.isLoading || tipoFertilizanteFactor.isLoading) {
    return <SkeletonForm />;
  }

  if (anios.isError || tipoFertilizanteFactor.isError) {
    return <div>Error</div>;
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
                    value={field.value}
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

            {/* Año */}
            <FormField
              control={form.control}
              name="anio"
              render={({ field }) => (
                <FormItem className="pt-2 w-full">
                  <FormLabel>Año</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el año" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="factor"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>
                    Factor{" "}
                    <span className="text-[9px]">
                      [kgCO2/{tipoFertilizanteSelected?.unidad}]
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Factor de emisión CO2"
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

            {/* Botón Guardar */}
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
