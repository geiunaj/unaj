import React, { useCallback, useEffect } from "react";
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
  TipoActivoRequest,
  UpdateTipoActivoProps,
} from "../services/tipoActivo.interface";
import {
  getTipoActivoById,
  getTipoActivoCategoria,
  getTipoActivoGrupo,
  updateTipoActivo,
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
  descripcionId: z.string().min(1, requiredMessage("descripcionId")),
  categoriaId: z.string().min(1, requiredMessage("categoriaId")),
  grupoId: z.string().min(1, requiredMessage("grupoId")),
  procesoId: z.string().min(1, requiredMessage("procesoId")),
});

export function UpdateFormTipoActivo({ id, onClose }: UpdateTipoActivoProps) {
  const form = useForm<z.infer<typeof TipoActivo>>({
    resolver: zodResolver(TipoActivo),
    defaultValues: {
      nombre: "",
      unidad: "",
      descripcionId: "",
      categoriaId: "",
      grupoId: "",
      procesoId: "",
    },
  });

  const tipoActivo = useQuery({
    queryKey: ["tipoActivo", id],
    queryFn: () => getTipoActivoById(id),
    refetchOnWindowFocus: false,
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

  const loadForm = useCallback(async () => {
    if (tipoActivo.data) {
      const tipoActivoData = await tipoActivo.data;
      form.reset({
        nombre: tipoActivoData.nombre,
        unidad: tipoActivoData.unidad,
        categoriaId: tipoActivoData.categoriaId.toString(),
        grupoId: tipoActivoData.grupoId.toString(),
      });
    }
  }, [tipoActivo.data, id]);

  useEffect(() => {
    loadForm();
  }, [loadForm, id]);

  const onSubmit = async (data: z.infer<typeof TipoActivo>) => {
    const tipoActivoRequest: TipoActivoRequest = {
      nombre: data.nombre,
      unidad: data.unidad,
      peso: 0,
      categoriaId: Number(data.categoriaId),
    };
    try {
      const response = await updateTipoActivo(id, tipoActivoRequest);
      onClose();
      successToast(response.data.message);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

  if (tipoActivo.isLoading || grupos.isLoading || categorias.isLoading) {
    return <SkeletonForm />;
  }

  if (tipoActivo.isError) {
    onClose();
    errorToast("Error al cargar el Tipo de Activo");
  }

  return (
    <div className="flex items-center justify-center max-w-md">
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
                      placeholder="Nombre del tipo de papel"
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
                      placeholder="Nombre del tipo de papel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-5">
              {/*CATEGORIA*/}
              <FormField
                name="categoriaId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="pt-2 w-1/2">
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
