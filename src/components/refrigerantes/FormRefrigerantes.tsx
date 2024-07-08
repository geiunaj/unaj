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

const Refrigerantes = z.object({
  sede: z.string(),
  name: z.string(),
  type_gas: z.string(),
  consumption_type_gas: z.number(),
  is_recarga: z.boolean(),
});

export function FormCombustion() {
  const form = useForm<z.infer<typeof Refrigerantes>>({
    resolver: zodResolver(Refrigerantes),
    defaultValues: {
      sede: "",
      name: "",
      type_gas: "",
      consumption_type_gas: 0,
      is_recarga: false,
    },
  });

  const submit = async (values: z.infer<typeof Refrigerantes>) => {
    console.log(values);
  };
  return (
    <div className="flex items-center justify-center w-[500px]">
      <div className="p-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl text-blue-800 font-bold mb-2 uppercase">
            REFRIGERANTES
          </h2>
          <p className="text-xs  text-gray-500">
            Indicar si hubo recarga de gases refrigerantes tanto para equipos de
            aire acondicionado como para otros equipos
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

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de equipo</FormLabel>
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
              <div className="flex gap-3">
                {/* Type_gas */}
                <FormField
                  control={form.control}
                  name="type_gas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Gas</FormLabel>
                      <Select>
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Seleciona el tipo de gas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tipo 1">
                            R410 (Aire Acondicionado)
                          </SelectItem>
                          <SelectItem value="Sede 2">

                          </SelectItem>
                          <SelectItem value="Sede 3">Sede Ayabacas</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {/* Consumo */}
                <FormField
                  control={form.control}
                  name="consumption_type_gas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumo por tipo de gas</FormLabel>
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
