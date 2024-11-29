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
import {
  AreaRequest,
  CreateAreaProps,
} from "@/components/area/services/area.interface";
import { createArea } from "@/components/area/services/area.actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSedes } from "@/components/sede/services/sede.actions";
import { useQuery } from "@tanstack/react-query";
import SkeletonForm from "@/components/Layout/skeletonForm";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const Area = z.object({
  nombre: z.string().min(1, requiredMessage("nombre")),
  sede: z.string(),
});

export function CreateFormArea({ onClose }: CreateAreaProps) {
  const form = useForm<z.infer<typeof Area>>({
    resolver: zodResolver(Area),
    defaultValues: {
      nombre: "",
      sede: "",
    },
  });

  const sedes = useQuery({
    queryKey: ["sedesForCreateArea"],
    queryFn: () => getSedes(),
    refetchOnWindowFocus: false,
  });

  const onSubmit = async (data: z.infer<typeof Area>) => {
    const areaRequest: AreaRequest = {
      nombre: data.nombre,
      sedeId: Number(data.sede),
    };
    try {
      const response = await createArea(areaRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data || error.response.data.message);
    }
  };

    if (sedes.isLoading) {
        return <SkeletonForm />;
    }

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
                      placeholder="Nombre del area"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="sede"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel>Sede</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sede" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {sedes.data!.map((sede) => (
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
