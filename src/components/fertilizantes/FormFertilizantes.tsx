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
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const Ferilizer = z.object({
  type_fertilizer: z.string(),
  name_fertilizer: z.string(),
  amount: z.number(),
  nitrogen_percentage: z.number(),
  is_datasheet: z.boolean(),
  datasheet: z.string().optional(), // Permite que el campo sea opcional
  sede: z.string(),
});

export function FormFertilizantes() {
  const form = useForm<z.infer<typeof Ferilizer>>({
    resolver: zodResolver(Ferilizer),
    defaultValues: {
      name_fertilizer: "",
      type_fertilizer: "",
      amount: 0,
      nitrogen_percentage: 0,
      is_datasheet: false,
      datasheet: "",
      sede: "",
    },
  });

  return (
    <div className="flex items-center justify-center w-[500px]">
      <div className="p-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl text-blue-800 font-bold mb-2 uppercase">
            Consumo Fertilizantes
          </h2>
          <p className="text-xs  text-gray-500">
            Indicar el consumo de fertilizantes por tipo y enviar su ficha
            técnica (considerar aquellos usados en prácticas agronómicas y/o
            mantenimiento de áreas verdes).
          </p>

          <Form {...form}>
            <form className="w-full flex flex-col gap-3 pt-3 ">
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
              {/* Tipo de Fertilizante */}
              <FormField
                name="type_fertilizer"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Fertilizante</FormLabel>
                    <Select>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleciona el tipo de Fertilizante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sede 1">
                          Fertilizantes Sinteticos
                        </SelectItem>
                        <SelectItem value="Sede 2">
                          Fertilizantes Organicos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name_fertilizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Fertilizante</FormLabel>
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
              <div className="flex gap-5">
                {/* amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
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
                {/* Nitrogen Percentage */}
                <FormField
                  control={form.control}
                  name="nitrogen_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de Nitrogeno</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                          placeholder="Porcentaje de Nitrogeno %"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* is_datasheet */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  className="data-[state=checked]:bg-blue-900 data-[state=unchecked]:bg-gray-400"
                />
                <Label htmlFor="airplane-mode">Cuenta con Ficha tecnica</Label>
              </div>
              {/* datasheet */}
              <FormField
                control={form.control}
                name="datasheet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ficha Tecnica</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Ficha tecnica"
                        type="file"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
