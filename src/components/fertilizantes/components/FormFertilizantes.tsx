"use client";

import React, { useEffect, useState } from "react";
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
import { useAnioStore } from "@/components/anio/lib/anio.store";

const Ferilizer = z.object({
  tipo_fertilizante: z.string().min(1, "Seleccione un tipo de fertilizante"),
  nombre_fertilizante: z.string().min(1, "Ingrese un nombre de fertilizante"),
  cantidad: z.number(),
  is_ficha: z.boolean(),
  fichatecnica: z.string().optional(), // Permite que el campo sea opcional
  sede: z.string().min(1, "Seleccione una sede"),
  anio: z.string().min(1, "Seleccione un año"),
});

export function FormFertilizantes({ onClose }: CreateFertilizanteProps) {
  const { sedes, loadSedes } = useSedeStore();
  const { anios, loadAnios } = useAnioStore();
  const { tiposFertilizante, loadTiposFertilizante } = useTipoFertilizante();
  const { createFertilizante } = useFertilizanteStore();

  const form = useForm<z.infer<typeof Ferilizer>>({
    resolver: zodResolver(Ferilizer),
    defaultValues: {
      nombre_fertilizante: "",
      tipo_fertilizante: "",
      cantidad: 0,
      // nitrogen_percentage: 0,
      is_ficha: false,
      fichatecnica: "",
      sede: "",
      anio: "",
    },
  });

  const { watch, setValue } = form;
  const isFicha = watch("is_ficha");
  const tipoFertilizante = watch("tipo_fertilizante");
  const [filteredNombres, setFilteredNombres] = useState<string[]>([]);

  useEffect(() => {
    loadSedes();
    loadAnios();
    loadTiposFertilizante();
  }, [loadSedes, loadTiposFertilizante, loadAnios]);

  useEffect(() => {
    if (tipoFertilizante) {
      const nombres = tiposFertilizante
        .filter((tipo) => tipo.clase === tipoFertilizante)
        .map((tipo) => tipo.nombre);
      setFilteredNombres(nombres);
    } else {
      setFilteredNombres([]);
    }
  }, [tipoFertilizante, tiposFertilizante]);

  const onSubmit = async (data: z.infer<typeof Ferilizer>) => {
    const fertilizanteRequest: FertilizanteRequest = {
      tipoFertilizante_id: parseInt(tipoFertilizante),
      cantidad: data.cantidad,
      sede_id: parseInt(data.sede),
      is_ficha: data.is_ficha,
      anio_id: parseInt(data.anio),
      // fichatecnica: data.fichatecnica,
    };
    console.log(fertilizanteRequest);
    await createFertilizante(fertilizanteRequest);
    onClose();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
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
                        <SelectValue placeholder="Selecciona tu sede" />
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
                  <Select
                    onValueChange={(value) =>
                      setValue("tipo_fertilizante", value)
                    }
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Fertilizante" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tiposFertilizante.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.clase}>
                            {tipo.clase}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Nombre del Fertilizante */}
            {tipoFertilizante && (
              <FormField
                name="nombre_fertilizante"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Nombre de Fertilizante</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Nombre de Fertilizante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {filteredNombres.map((nombre, index) => (
                            <SelectItem key={index} value={nombre}>
                              {nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-4">
              {/* Cantidad */}
              <FormField
                control={form.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Cantidad de fertilizante</FormLabel>
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
              {/* año */}
              <FormField
                control={form.control}
                name="anio"
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Año</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el año" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {anios.map((anio) => (
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
            </div>

            {/* is_ficha */}
            <FormField
              control={form.control}
              name="is_ficha"
              render={({ field }) => (
                <FormItem className="pt-2">
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
