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
  UpdateFactorEmisionSEINProps,
  FactorEmisionSEINRequest,
} from "../services/factorEmisionSEIN.interface";
import { getAnio } from "@/components/anio/services/anio.actions";
import {
  showFactorSEIN,
  updateFactorSEIN,
} from "../services/factorEmisionSEIN.actions";
import { STEP_NUMBER } from "@/lib/constants/menu";

const UpdateFactorConversionSEIN = z.object({
  anio: z.string().min(1, "Selecciona un año"),
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

export function UpdateFormFactorSEIN({
  id,
  onClose,
}: UpdateFactorEmisionSEINProps) {
  const form = useForm<z.infer<typeof UpdateFactorConversionSEIN>>({
    resolver: zodResolver(UpdateFactorConversionSEIN),
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

  const factorSEIN = useQuery({
    queryKey: ["factorSEIN"],
    queryFn: () => showFactorSEIN(id),
    refetchOnWindowFocus: false,
  });

  const loadForm = useCallback(async () => {
    if (factorSEIN.data) {
      const factorData = await factorSEIN.data;
      form.reset({
        anio: factorData.anioId.toString(),
        factorCO2: factorData.factorCO2,
        factorCH4: factorData.factorCH4,
        factorN2O: factorData.factorN2O,
        fuente: factorData.fuente,
        link: factorData.link,
      });
    }
  }, [factorSEIN.data, form]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const onSubmit = async (data: z.infer<typeof UpdateFactorConversionSEIN>) => {
    const factorSEINRequest: FactorEmisionSEINRequest = {
      anioId: parseInt(data.anio),
      factorCO2: data.factorCO2,
      factorCH4: data.factorCH4,
      factorN2O: data.factorN2O,
      fuente: data.fuente,
      link: data.link,
    };

    try {
      const response = await updateFactorSEIN(id, factorSEINRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(
        error.response?.data?.message || "Error actualizando factor de emisión"
      );
    }
  };

  if (factorSEIN.isLoading || anios.isLoading) {
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
            {/* Factor CO2 */}
            <FormField
              control={form.control}
              name="factorCO2"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>
                    Factor de emisión{" "}
                    <span className="text-[9px]">[kgCO2/kWh]</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Factor de emisión"
                      step={STEP_NUMBER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*/!* Factor CH4 *!/*/}
            {/*<FormField*/}
            {/*    control={form.control}*/}
            {/*    name="factorCH4"*/}
            {/*    render={({ field }) => (*/}
            {/*        <FormItem className="pt-2">*/}
            {/*            <FormLabel>Factor de emisión CH4</FormLabel>*/}
            {/*            <FormControl>*/}
            {/*                <Input*/}
            {/*                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"*/}
            {/*                    placeholder="Factor de emisión CH4"*/}
            {/*                    {...field}*/}
            {/*                />*/}
            {/*            </FormControl>*/}
            {/*            <FormMessage />*/}
            {/*        </FormItem>*/}
            {/*    )}*/}
            {/*/>*/}
            {/*/!* Factor N2O *!/*/}
            {/*<FormField*/}
            {/*    control={form.control}*/}
            {/*    name="factorN2O"*/}
            {/*    render={({ field }) => (*/}
            {/*        <FormItem className="pt-2">*/}
            {/*            <FormLabel>Factor de emisión N2O</FormLabel>*/}
            {/*            <FormControl>*/}
            {/*                <Input*/}
            {/*                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"*/}
            {/*                    placeholder="Factor de emisión N2O"*/}
            {/*                    {...field}*/}
            {/*                />*/}
            {/*            </FormControl>*/}
            {/*            <FormMessage />*/}
            {/*        </FormItem>*/}
            {/*    )}*/}
            {/*/>*/}

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
