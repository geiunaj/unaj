'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

export default function LoginPage() {

  

  // CONSTANTES DE IMAGNES DE FONDO Y LOGO
  const fondo = "/img/fondoLogin.png";
  const logo = "/img/logoUNAJ.png";

  // SCHEMA DE VALIDACIÓN DE FORMULAR

  const authSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  });

  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // FUNCIÓN DE INICIO DE SESIÓN
  const submit = async (values: z.infer<typeof authSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (!result) {
      console.error('Login fallido: No se recibió una respuesta del servidor');
      return;
    }

    if (result.error) {
      console.error('Login fallido:', result.error);
    } else {
      console.log('Login exitoso');
      window.location.href = "/home"; // Redirige al usuario después del login
    }
  };

  return (
    <div className="flex">
      <div className="w-2/3">
        <img src={fondo} className="w-full h-screen object-cover" alt="Fondo UNAJ" />
      </div>
      <div className="w-1/3">
        <div className="flex items-center justify-center min-h-screen max-w-screen-sm">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center">
              <img src={logo} className="w-56 h-16 mb-14" alt="Logo UNAJ" />
              <h2 className="text-2xl text-blue-800 font-bold mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-gray-500">
                Bienvenido a la UNAJ Virtual, por favor inicie sesión para continuar.
              </p>
              <Form {...form}>
                <form
                  className="pt-8 w-full flex flex-col gap-4"
                  onSubmit={form.handleSubmit(submit)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="mail@unaj.edu.pe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="*********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Iniciar Sesión
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
