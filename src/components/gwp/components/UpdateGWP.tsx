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

import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { errorToast, successToast } from "@/lib/utils/core.function";
import { UpdateGPWProps, GPWRequest } from "../services/gwp.interface";
import { getGPW, showGPW, updateGPW } from "../services/gwp.actions";
import { useQuery } from "@tanstack/react-query";
import SkeletonForm from "@/components/Layout/skeletonForm";

const parseNumber = (val: any) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const GWP = z.object({
  nombre: z.string().min(1, "Ingrese el nombre"),
  formula: z.string().min(1, "Ingrese la fórmula química"),
  valor: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
});

export function UpdateFormGWP({ id, onClose }: UpdateGPWProps) {
  const form = useForm<z.infer<typeof GWP>>({
    resolver: zodResolver(GWP),
    defaultValues: {
      nombre: "",
      formula: "",
      valor: 0,
    },
  });

  const gwpData = useQuery({
    queryKey: ["gwp", id],
    queryFn: () => showGPW(id),
    refetchOnWindowFocus: false,
  });

  const loadForm = useCallback(async () => {
    if (gwpData.data) {
      const gwp = gwpData.data;
      form.reset({
        nombre: gwp.nombre,
        formula: gwp.formula,
        valor: gwp.valor,
      });
    }
  }, [gwpData.data, id]);

  useEffect(() => {
    loadForm();
  }, [loadForm, id]);

  const onSubmit = async (data: z.infer<typeof GWP>) => {
    const gwpRequest: GPWRequest = {
      nombre: data.nombre,
      formula: data.formula,
      valor: data.valor,
    };
    try {
      const response = await updateGPW(id, gwpRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response?.data?.message);
    }
  };

  if (gwpData.isLoading) {
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
            {/* NOMBRE */}
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
                      placeholder="Nombre del GWP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FORMULA */}
            <FormField
              control={form.control}
              name="formula"
              render={({ field }) => (
                <FormItem className="pt-2 w-full">
                  <FormLabel>Fórmula Química</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Fórmula química"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VALOR */}
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem className="pt-2 w-full">
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BOTÓN SUBMIT */}
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
