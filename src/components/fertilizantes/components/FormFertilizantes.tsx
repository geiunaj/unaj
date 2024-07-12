"use client";

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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CreateFertilizanteProps,
  FertilizanteRequest,
} from "../services/fertilizante.interface";
import { useSedeStore } from "@/components/sede/lib/sede.store";
import { useTipoFertilizante } from "@/components/tipoFertilizante/lib/tipoFertilizante.store";
import { useFertilizanteStore } from "../lib/fertilizante.store";

const Ferilizer = z.object({
  tipo_fertilizante: z.string().min(1, "Seleccione un tipo de fertilizante"),
  nombre_fertilizante: z.string().min(1, "Ingrese un nombre de fertilizante"),
  cantidad: z.number(),
  nitrogen_percentage: z.number(),
  is_ficha: z.boolean(),
  fichatecnica: z.string().optional(), // Permite que el campo sea opcional
  sede: z.string().min(1, "Seleccione una sede"),
});

export function FormFertilizantes({ onClose }: CreateFertilizanteProps) {
  const { sedes, loadSedes } = useSedeStore();
  const { tiposFertilizante, loadTiposFertilizante } = useTipoFertilizante();
  const { createFertilizante } = useFertilizanteStore();

  const form = useForm<z.infer<typeof Ferilizer>>({
    resolver: zodResolver(Ferilizer),
    defaultValues: {
      nombre_fertilizante: "",
      tipo_fertilizante: "",
      cantidad: 0,
      nitrogen_percentage: 0,
      is_ficha: false,
      fichatecnica: "",
      sede: "",
    },
  });

  const { watch } = form;
  const isFicha = watch("is_ficha");
  const tipoFertilizante = watch("tipo_fertilizante");

  useEffect(() => {
    loadSedes();
    loadTiposFertilizante();
  }, [loadSedes, loadTiposFertilizante]);

  // const onSubmit = async (data: z.infer<typeof Ferilizer>) => {
  //   const fertilizanteRequest: FertilizanteRequest = {
  //     // fertilizanteTipo: data.tipo_fertilizante,
  //     // fertilizante: data.nombre_fertilizante,
  //     // cantidadFertilizante: data.cantidad,
  //     // porcentajeN: data.nitrogen_percentage,
  //     is_ficha: data.is_ficha,
  //     // ficha: data.fichatecnica,
  //     sede_id: Number(data.sede),
  //   };
  //   console.log(fertilizanteRequest);
  //   await createFertilizante(fertilizanteRequest);
  //   onClose();
  // };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-2"
            // onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Sede */}
            <FormField
              name="sede"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Sede</FormLabel>
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
                        {sedes.map((sede) => (
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

            {/* Tipo de Fertilizante */}
            <FormField
              name="tipo_fertilizante"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Tipo de Fertilizante</FormLabel>
                  <Select>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Fertilizante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tiposFertilizante.map((tipo_fertilizante) => (
                          <SelectItem
                            key={tipo_fertilizante.id}
                            value={tipo_fertilizante.id.toString()}
                          >
                            {tipo_fertilizante.clase}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Name */}
            {/* {tipoFertilizante && (
              <FormField
                control={form.control}
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Nombre de Fertilizante</FormLabel>
                    <Select {...field}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Nombre de Fertilizante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {tipo_fertilizante.filter(
                              (tipo_fertilizante) =>
                                tipo_fertilizante.id ===
                                tipoFertilizante.id
                            )
                            .map((tipo_fertilizante) => (
                              <SelectItem
                                key={tipo_fertilizante.id}
                                value={tipo_fertilizante.id.toString()}
                              >
                                {tipo_fertilizante.nombre}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )} */}

            {/* cantidad */}
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem className="pt-2 w-1/2">
                  <FormLabel>Cantida de fertilizante</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Cantidad Kg/año"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Nitrogen Percentage
              <FormField
                control={form.control}
                name="nitrogen_percentage"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>% Nitrogeno</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="% Nitrogeno"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

            {/* is_ficha */}
            <FormField
              control={form.control}
              name="is_ficha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="inline-block">
                    ¿Cuenta con ficha tecnica?
                  </FormLabel>
                  <FormControl className="inline-block ml-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  {isFicha && (
                    <FormField
                      control={form.control}
                      name="fichatecnica"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-full p-2 rounded mt-1 focus:outline-none focus-visible:ring-offset-0"
                              type="file"
                              placeholder="Suba la ficha tecnica"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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
