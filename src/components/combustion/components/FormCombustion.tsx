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
import { Button } from "../../ui/button";
import { Calendar } from "lucide-react";
import { useSedeStore } from "@/components/sede/lib/sede.store";
import { useTipoCombustibleStore } from "@/components/tipoCombustible/lib/tipoCombustible.store";

const Combustion = z.object({
  sede: z.string().min(1, "Selecciona la sede"),
  type_equipment: z.string().min(1, "Ingresa el tipo de equipo"),
  type_combustion: z.string().min(1, "Selecciona el tipo de combustible"),
  unit: z.string().min(1, "Ingresa la unidad"),
  month: z.string().min(1, "Selecciona el mes"),
  año: z.string().min(1, "Seleciona el año"),
  consumo: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(0, "Ingresa un valor mayor a 0")
  ),
});

export function FormCombustion() {
  const { sedes, loadSedes } = useSedeStore();
  const { tiposCombustible, loadTiposCombustible } = useTipoCombustibleStore();
  const form = useForm<z.infer<typeof Combustion>>({
    resolver: zodResolver(Combustion),
    defaultValues: {
      sede: "",
      type_combustion: "",
      type_equipment: "",
      unit: "",
      month: "",
      año: "",
      consumo: 0,
    },
  });

  useEffect(() => {
    loadSedes();
    loadTiposCombustible();
  }, [loadSedes, loadTiposCombustible]); // Dependencia vacía para solo llamar una vez al montar

  const onSubmit = (data: z.infer<typeof Combustion>) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      {/* <div className="flex flex-col w-full h-16 bg-gray-200 p-4 rounded"> */}
      <h2 className="text-2xl text-blue-600 font-bold uppercase text-center">
        COMBUSTION ESTACIONARIA
      </h2>
      <p className="text-xs text-gray-500 text-center">
        Indicar el consumo de combustible de equipos estacionarios, incluir
        balones usados en calefacción
      </p>
      {/* </div> */}
      <div className="flex flex-col items-center justify-center mt-4">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-3 pt-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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

            <FormField
              control={form.control}
              name="type_equipment"
              render={({ field }) => (
                <FormItem className="flex-1 pt-2">
                  <FormLabel>Equipo</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Buses, Camiones, etc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="type_combustion"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Tipo de Combustible</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona un tipo de combustible" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {tiposCombustible.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name="month"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Selecciona el mes y año</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Calendar className="font-light text-gray-900" />
                    <div className="flex flex-1 space-x-2">
                      <div className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="enero">Enero</SelectItem>
                            <SelectItem value="febrero">Febrero</SelectItem>
                            <SelectItem value="marzo">Marzo</SelectItem>
                            <SelectItem value="abril">Abril</SelectItem>
                            <SelectItem value="mayo">Mayo</SelectItem>
                            <SelectItem value="junio">Junio</SelectItem>
                            <SelectItem value="julio">Julio</SelectItem>
                            <SelectItem value="agosto">Agosto</SelectItem>
                            <SelectItem value="septiembre">
                              Septiembre
                            </SelectItem>
                            <SelectItem value="octubre">Octubre</SelectItem>
                            <SelectItem value="noviembre">Noviembre</SelectItem>
                            <SelectItem value="diciembre">Diciembre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Select>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Año" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2021">2021</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="consumo"
                render={({ field }) => (
                  <FormItem className="flex-1 pt-2">
                    <FormLabel>Consumo mensual</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex-1 pt-2">
                    <FormLabel>Unidad</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Galones, Litros, m3, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-3 w-full p-3">
              <Button type="submit" className="w-full bg-blue-700">
                Guardar
              </Button>
              <Button type="button" className="w-full" variant="secondary">
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
