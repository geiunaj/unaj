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
import { getAnio } from "@/components/anio/services/anio.actions";
import { errorToast, successToast } from "@/lib/utils/core.function";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
  CreateFactorEmisionSEINProps,
  FactorEmisionSEINRequest,
} from "../services/factorEmisionSEIN.interface";
import { createFactorSEIN } from "../services/factorEmisionSEIN.actions";
import { STEP_NUMBER } from "@/lib/constants/menu";

const FactorConversionSEIN = z.object({
  anio: z.string().min(1, "Seleciona el anio"),
  factorCO2: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
  factorCH4: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
  factorN2O: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
  fuente: z.string().min(1, "Ingrese una fuente"),
  link: z.string().optional(),
});

export function FormFactorSEIN({ onClose }: CreateFactorEmisionSEINProps) {
  const form = useForm<z.infer<typeof FactorConversionSEIN>>({
    resolver: zodResolver(FactorConversionSEIN),
    defaultValues: {
      anio: "",
      factorCO2: 0,
      factorCH4: 0,
      factorN2O: 0,
      fuente: "",
      link: "",
    },
  });

  const anios = useQuery({
    queryKey: ["anio"],
    queryFn: () => getAnio(),
    refetchOnWindowFocus: false,
  });

  const onSubmit = async (data: z.infer<typeof FactorConversionSEIN>) => {
    const FactorSEINRequest: FactorEmisionSEINRequest = {
      anioId: parseInt(data.anio),
      factorCO2: data.factorCO2,
      factorCH4: data.factorCH4,
      factorN2O: data.factorN2O,
      fuente: data.fuente,
      link: data.link,
    };

    try {
      const response = await createFactorSEIN(FactorSEINRequest);
      onClose();
      successToast(response.data.message);
    } catch (error) {
      errorToast("Error creando factor de emisión");
    }
  };

  if (anios.isLoading) {
    return <SkeletonForm />;
  }

  if (anios.isError) {
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
                        <SelectValue placeholder="Seleciona tu sede" />
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
              name="factorCO2"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>
                    Factor de Emisión{" "}
                    <span className="text-[9px]">[kgCO2/kWh]</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Factor de emisión CO2"
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
