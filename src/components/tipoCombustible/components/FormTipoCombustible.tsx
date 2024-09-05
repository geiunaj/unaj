import React from "react";
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

import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";

import SkeletonForm from "@/components/Layout/skeletonForm";
import {
  CreateTipoCombustibleProps,
  TipoCombustibleRequest,
} from "../services/tipoCombustible.interface";
import { createTipoCombustible } from "../services/tipoCombustible.actions";
import { errorToast, successToast } from "@/lib/utils/core.function";

const TipoCombustible = z.object({
  nombre: z.string().min(1, "Ingrese un nombre"),
  abreviatura: z.string().min(1, "Ingrese una abreviatura"),
  unidad: z.string().min(1, "Ingrese una unidad"),
  // valorCalorico: z.preprocess((val) => parseFloat(val as string,),
  //     z.number().min(0, "Ingresa un valor mayor a 0")),
  // factorEmisionCO2: z.preprocess((val) => parseFloat(val as string,),
  //     z.number().min(0, "Ingresa un valor mayor a 0")),
  // factorEmisionCH4: z.preprocess((val) => parseFloat(val as string,),
  //     z.number().min(0, "Ingresa un valor mayor a 0")),
  // factorEmisionN2O: z.preprocess((val) => parseFloat(val as string,),
  //     z.number().min(0, "Ingresa un valor mayor a 0")),
});

export function FromTipoCombustible({ onClose }: CreateTipoCombustibleProps) {
  const form = useForm<z.infer<typeof TipoCombustible>>({
    resolver: zodResolver(TipoCombustible),
    defaultValues: {
      nombre: "",
      abreviatura: "",
      unidad: "",
      // valorCalorico: 0,
      // factorEmisionCO2: 0,
      // factorEmisionCH4: 0,
      // factorEmisionN2O: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof TipoCombustible>) => {
    const tipoCombustibleRequest: TipoCombustibleRequest = {
      nombre: data.nombre,
      abreviatura: data.abreviatura,
      unidad: data.unidad,
      // valorCalorico: data.valorCalorico,
      // factorEmisionCO2: data.factorEmisionCO2,
      // factorEmisionCH4: data.factorEmisionCH4,
      // factorEmisionN2O: data.factorEmisionN2O,
    };
    try {
      const response = await createTipoCombustible(tipoCombustibleRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      console.error(error);
      errorToast(error.response?.data?.message);
    }
  };

  // if (sedeQuery.isFetching || tipoPapelQuery.isFetching || anioQuery.isFetching
  //     || sedeQuery.isError || tipoPapelQuery.isError || anioQuery.isError) {
  //     return <SkeletonForm/>;
  // }

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
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-5">
              {/* abreviatura */}
              <FormField
                control={form.control}
                name="abreviatura"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Abreviatura</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="GAS, DIE, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unidad */}
              <FormField
                control={form.control}
                name="unidad"
                render={({ field }) => (
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
                    <FormMessage />
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
