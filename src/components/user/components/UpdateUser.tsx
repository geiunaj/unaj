import React, {useCallback, useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {UserRequest, CreateUserProps, UpdateUserProps} from "@/components/user/services/user.interface";
import {createUser, getUserById, updateUser} from "@/components/user/services/user.actions";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useQuery} from "@tanstack/react-query";
import {getRol} from "@/components/rol/services/rol.actions";
import SkeletonForm from "@/components/Layout/skeletonForm";
import {getSedes} from "@/components/sede/services/sede.actions";

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const User = z.object({
    nombre: z.string().min(1, requiredMessage("nombre")),
    email: z.string().email(),
    telefono: z.string().min(1, requiredMessage("telefono")),
    password: z.string().optional(),
    type_user_id: z.string().min(1, requiredMessage("tipo de usuario")),
    sede_id: z.string().min(1, requiredMessage("sede")),
});

export function UpdateUser({id, onClose}: UpdateUserProps) {
    const form = useForm<z.infer<typeof User>>({
        resolver: zodResolver(User),
        defaultValues: {
            nombre: "",
            email: "",
            telefono: "",
            password: "",
            type_user_id: "",
            sede_id: "",
        },
    });

    const user = useQuery({
        queryKey: ['userById'],
        queryFn: () => getUserById(id),
        refetchOnWindowFocus: false,
    });

    const roles = useQuery({
        queryKey: ['rolesForUser'],
        queryFn: () => getRol(),
        refetchOnWindowFocus: false,
    });

    const sedes = useQuery({
        queryKey: ['sedesForUser'],
        queryFn: () => getSedes(),
        refetchOnWindowFocus: false,
    });

    const loadForm = useCallback(async () => {
        if (user.data) {
            const userData = await user.data;
            form.reset({
                nombre: userData.name,
                email: userData.email,
                telefono: userData.telefono,
                password: "",
                type_user_id: userData.type_user_id.toString(),
                sede_id: userData.sede_id?.toString(),
            });
        }
    }, [user.data, id]);

    useEffect(() => {
        loadForm();
    }, [loadForm, id]);

    const onSubmit = async (data: z.infer<typeof User>) => {
        const userRequest: UserRequest = {
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            password: data.password,
            type_user_id: Number(data.type_user_id),
            sede_id: Number(data.sede_id),
        };
        try {
            const response = await updateUser(id, userRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    if (roles.isLoading || sedes.isLoading || user.isLoading) return <SkeletonForm/>;

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-1 pt-2 "
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*NOMBRE*/}
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Nombre"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*EMAIL*/}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*TELEFONO*/}
                        <FormField
                            control={form.control}
                            name="telefono"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Telefono</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Telefono"
                                            max={9}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*CONTRASEÑA*/}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Contraseña"
                                            minLength={8}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/*TIPO DE USUARIO*/}
                        <FormField
                            name="type_user_id"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Rol</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione un rol"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {roles.data!.map((rol) => (
                                                    <SelectItem key={rol.id} value={rol.id.toString()}>
                                                        {rol.type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {/*SEDE*/}
                        <FormField
                            name="sede_id"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="pt-2">
                                    <FormLabel>Sede</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleciona tu sede"/>
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
