"use client";

import React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
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
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const Ferilizer = z.object({
  type_hoja: z.string(),
  gramaje: z.number().positive(),
  unit: z.string(),
  quantity_packaging: z.number().positive(),
  is_recycled: z.boolean(),
  is_certified: z.boolean(),
  percentage_recycled: z.number().min(0).max(100).optional(),
  name_certified: z.string().optional(),
  comentary: z.string().optional(),
  sede: z.string(),
});

export function FormPapel() {
  const form = useForm<z.infer<typeof Ferilizer>>({
    resolver: zodResolver(Ferilizer),
    defaultValues: {
      type_hoja: "",
      gramaje: 0,
      unit: "",
      quantity_packaging: 0,
      is_recycled: false,
      is_certified: false,
      percentage_recycled: undefined,
      name_certified: "",
      comentary: "",
      sede: "",
    },
  });

  const { watch } = form;
  const isRecycled = watch("is_recycled");
  const isCertified = watch("is_certified");

  return (
    <div className="flex items-center justify-center">
      <div className="p-3">
        <div className="flex flex-col items-center justify-center w-[500px]">
          <h2 className="text-2xl text-blue-800 font-bold mb-2 uppercase">
            Consumo Papel
          </h2>

          <Form {...form}>
            <form className="w-full flex flex-col gap-3 pt-3 ">
              {/* Sede */}
              <FormField
                name="sede"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sede</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu sede" />
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
              {/* Tipo de hoja */}
              <FormField
                name="type_hoja"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de hoja</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de hoja " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Tipo 1">Tipo 1</SelectItem>
                        <SelectItem value="Tipo 2">Tipo 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* unit */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Unidades de hoja por empaque"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-5">
                {/* quantity_packaging */}
                <FormField
                  control={form.control}
                  name="quantity_packaging"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad de empaques</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                          placeholder="Cantidad de empaques [unidad/año]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Gramaje */}
                <FormField
                  control={form.control}
                  name="gramaje"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gramaje</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          type="number"
                          className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                          placeholder="Gramaje [g]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* is_recycled */}
              <FormField
                control={form.control}
                name="is_recycled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Es reciclado?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* percentage_recycled */}
              {isRecycled && (
                <FormField
                  control={form.control}
                  name="percentage_recycled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje reciclado</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                          placeholder="Porcentaje reciclado [%]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* is_certified */}
              <FormField
                control={form.control}
                name="is_certified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Es certificado?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* name_certified */}
              {isCertified && (
                <FormField
                  control={form.control}
                  name="name_certified"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del certificado</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                          placeholder="Nombre del certificado"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Comentario */}
              <FormField
                control={form.control}
                name="comentary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentario</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                        placeholder="Comentario adicional"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 w-full ">
                <Button type="submit" className="w-full bg-blue-900">
                  Guardar
                </Button>
                <Button type="button" className="w-full bg-blue-900">
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
