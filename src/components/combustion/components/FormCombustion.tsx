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
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";

const Combustion = z.object({
  sede: z.string(),
  type_equipment: z.string(),
  type_combustion: z.string(),
  unit: z.string(),
  month: z.string().min(1, "Seleciona un país"),
  consumption_month: z.number(),
});

export function FormCombustion() {
  const form = useForm<z.infer<typeof Combustion>>({
    resolver: zodResolver(Combustion),
    defaultValues: {
      sede: "",
      type_combustion: "",
      type_equipment: "",
      unit: "",
      month: "",
      consumption_month: 0,
    },
  });

  // SUBMIT PREVENT DEFAULT
  const onSubmit = (data: z.infer<typeof Combustion>) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center w-[500px]">
      <div className="p-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl text-blue-800 font-bold mb-2 uppercase">
            COMBUSTION ESTACIONARIA
          </h2>
          <p className="text-xs  text-gray-500">
            Indicar el consumo de combustible de equipos estacionarios (grupo
            electrógeno, caldera, entre otros). Incluir balones usados en
            calefacción
          </p>

          <Form {...form}>
            <form
              className="w-full flex flex-col gap-3 pt-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Sede */}
              <FormField
                name="sede"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
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
                          Sede La Capilla (SAcadémico)
                        </SelectItem>
                        <SelectItem value="Sede 3">Sede Ayabacas</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Tipo de equipo */}
              <FormField
                name="type_equipment"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                    <Select>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleciona un tipo de equipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Equipo 1">Equipo 1</SelectItem>
                        <SelectItem value="Equipo 2">Equipo 2</SelectItem>
                        <SelectItem value="Equipo 3">Equipo 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Tipo de combustion*/}
              <FormField
                name="type_combustion"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustible</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleciona un tipo de combustible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Gasolina">Gasolina</SelectItem>
                        <SelectItem value="Gas">Gas</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* Month */}
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Selecciona el mes</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            // className={cn(
                            //   "w-[240px] pl-3 text-left font-normal",
                            //   !field.value && "text-muted-foreground"
                            // )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          // selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                {/* Consumption_month */}
                <FormField
                  control={form.control}
                  name="consumption_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumo mensual</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Unit */}
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
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
              <div className="flex  gap-3 w-full ">
                <Button type="submit" className="w-full bg-blue-900">
                  Guardar
                </Button>
                <Button type="submit" className="w-full  bg-blue-900">
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
