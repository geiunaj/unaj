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
import { errorToast, successToast } from "@/lib/utils/core.function";
import { CreateGPWProps, GPWRequest } from "../services/gwp.interface";
import { createGPW } from "../services/gwp.actions";

const parseNumber = (val: any) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const GWP = z.object({
  nombre: z.string().min(1, "Ingrese el nombre"),
  formula: z.string().min(1, "Ingrese la formula quimica"),
  valor: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
});

export function CreateFormGWP({ onClose }: CreateGPWProps) {
  const form = useForm<z.infer<typeof GWP>>({
    resolver: zodResolver(GWP),
    defaultValues: {
      nombre: "",
      formula: "",
      valor: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof GWP>) => {
    const GWPRequest: GPWRequest = {
      nombre: data.nombre,
      formula: data.formula,
      valor: data.valor,
    };
    try {
      const response = await createGPW(GWPRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-3 pt-2 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/*NOMBRE*/}
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
                      placeholder="Nombre del tipo de papel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              {/*FORMULA*/}
              <FormField
                control={form.control}
                name="formula"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Formula</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        type="text"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*UNIDAD PAQUETE*/}
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Valor"
                        step="0.01"
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
