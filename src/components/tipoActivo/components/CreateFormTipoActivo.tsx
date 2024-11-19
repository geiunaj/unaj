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
import SkeletonForm from "@/components/Layout/skeletonForm";
import {
  CreateTipoActivoProps,
  TipoActivoRequest,
} from "../services/tipoActivo.interface";
import {
  createTipoActivo,
  getTipoActivoCategoria,
  getTipoActivoGrupo,
} from "../services/tipoActivo.actions";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorToast, successToast } from "@/lib/utils/core.function";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const TipoActivo = z.object({
  nombre: z.string().min(1, requiredMessage("nombre")),
  unidad: z.string().min(1, requiredMessage("unidad")),
  categoriaId: z.string().min(1, requiredMessage("categoriaId")),
  grupoId: z.string().min(1, requiredMessage("grupoId")),
  peso: z.string().transform(parseNumber),
  costoUnitario: z.string().transform(parseNumber),
  fuente: z.string().optional(),
});

export function CreateFormTipoActivo({ onClose }: CreateTipoActivoProps) {
  const form = useForm<z.infer<typeof TipoActivo>>({
    resolver: zodResolver(TipoActivo),
    defaultValues: {
      nombre: "",
      unidad: "",
      categoriaId: "",
      grupoId: "",
      peso: 0,
      costoUnitario: 0,
      fuente: "",
    },
  });

  const grupos = useQuery({
    queryKey: ["grupos"],
    queryFn: () => getTipoActivoGrupo(),
    refetchOnWindowFocus: false,
  });
  const categorias = useQuery({
    queryKey: ["categorias"],
    queryFn: () => getTipoActivoCategoria(),
    refetchOnWindowFocus: false,
  });

  const onSubmit = async (data: z.infer<typeof TipoActivo>) => {
    const TipoActivoRequest: TipoActivoRequest = {
      nombre: data.nombre,
      unidad: data.unidad,
      peso: 0,
      costoUnitario: 0,
      fuente: "",
      categoriaId: Number(data.categoriaId),
    };
    try {
      const response = await createTipoActivo(TipoActivoRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

  if (categorias.isLoading || grupos.isLoading) {
    return <SkeletonForm />;
  }

  return (
    <div className="flex items-center justify-center max-w-md">
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-3 pt-2"
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
                      placeholder="Nombre del tipo de consumible"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*UNIDAD*/}
            <FormField
              control={form.control}
              name="unidad"
              render={({ field }) => (
                <FormItem className="pt-2 w-full">
                  <FormLabel>Unidad</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                      placeholder="Unidad del tipo de consumible"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full gap-5">
              {/*CATEGORIA*/}
              <FormField
                name="categoriaId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {categorias.data!.map((categoria) => (
                            <SelectItem
                              key={categoria.id}
                              value={categoria.id.toString()}
                            >
                              {categoria.nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5">
              {/*GRUPO*/}
              <FormField
                name="grupoId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Grupo</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {grupos.data!.map((grupo) => (
                            <SelectItem
                              key={grupo.id}
                              value={grupo.id.toString()}
                            >
                              {grupo.nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

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
