"use client";

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
import { Calendar } from 'lucide-react';

const Combustion = z.object({
  sede: z.string(),
  month: z.string().min(1, "Selecciona el mes"),
  año: z.string().min(1, "Seleciona el año"),
  consumption_month: z.number(),
});

export function FormElectricidad() {
  const form = useForm<z.infer<typeof Combustion>>({
    resolver: zodResolver(Combustion),
    defaultValues: {
      sede: "",
      month: "",
      año: "",
      consumption_month: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof Combustion>) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      {/* <div className="flex flex-col w-full h-16 bg-gray-200 p-4 rounded"> */}
      <h2 className="text-2xl text-gray-800 font-bold uppercase text-center">
        CONSUMO DE ENERGIA ELECTRICA
      </h2>
      <p className="text-xs text-gray-500 text-center">
        Indicar el consumo de energía eléctica de la Red para cada suministro
      </p>
      {/* </div> */}
      <div className="flex flex-col items-center justify-center mt-4 w-full">
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
                  <Select>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona tu sede" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sede 1">
                        Sede La Capilla (Administrativo)
                      </SelectItem>
                      <SelectItem value="Sede 2">
                        Sede La Capilla (Académico)
                      </SelectItem>
                      <SelectItem value="Sede 3">Sede Ayabacas</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consumption_month"
              render={({ field }) => (
                <FormItem className="flex-1 pt-2">
                  <FormLabel>Consumo mensual</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      {...field}
                      placeholder="Consumo mensual en kWh"
                    />
                  </FormControl>
                  <FormMessage />
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
                        <Select>
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
