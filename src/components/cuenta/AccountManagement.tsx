'use client'

import {useForm, SubmitHandler} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {ChangeTitle} from "@/components/TitleUpdater";
import {ProfileRequest} from "@/components/cuenta/services/account.interface";
import {useSession} from "next-auth/react";
import {updatePassword, updateProfile} from "@/components/cuenta/services/account.actions";
import {errorToast, successToast} from "@/lib/utils/core.function";

const profileSchema = z.object({
    name: z.string().min(2, {message: 'El nombre debe tener al menos 2 caracteres'}),
    email: z.string().email({message: 'Ingrese un email válido'}),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(8, {message: 'La contraseña debe tener al menos 8 caracteres'}),
    newPassword: z.string().min(8, {message: 'La contraseña debe tener al menos 8 caracteres'}),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function AccountManagement() {
    ChangeTitle('Cuenta');
    const session: any = useSession();
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: session ? session.data?.user.name : '',
            email: session ? session.data?.user.email : '',
        },
    })

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        const id = session.data?.id;
        const profileData: ProfileRequest = {
            name: data.name,
            email: data.email,
        }
        await updateProfile(id, profileData)
            .then(async (response: any) => {
                successToast(response.data.message);
                await session.update();
            })
            .catch((error: any) => {
                errorToast(error.response.data.message);
            });
    }


    const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
        const id = session.data?.id;
        const passwordData = {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        }
        await updatePassword(id, passwordData)
            .then(async (response: any) => {
                successToast(response.data.message);
                passwordForm.reset();
            })
            .catch((error: any) => {
                errorToast(error.response.data.message);
            });
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-xl font-medium mb-4">Administración de Cuenta</h1>
            <div className="space-y-5">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Información del Perfil</CardTitle>
                        <CardDescription className="text-xs">Actualiza tus datos personales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                                  className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <FormField
                                    control={profileForm.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={profileForm.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <Label>Rol</Label>
                                    <Input className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                           value="Usuario" disabled/>
                                </div>
                                <Button type="submit" className="md:col-start-3">Actualizar Perfil</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Cambiar Contraseña</CardTitle>
                        <CardDescription className="text-xs">Actualiza tu contraseña de acceso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Contraseña Actual</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                    type="password" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nueva Contraseña</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                    type="password" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Contraseña</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full p-2 rounded focus:outline-none focus-visible:ring-offset-0"
                                                    type="password" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="md:col-start-3 md:self-end">Cambiar Contraseña</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

