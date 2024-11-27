import prisma from "@/lib/prisma";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import {Session, User} from "next-auth";
import {JWT} from "next-auth/jwt";


const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req): Promise<any> {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email y contraseña son requeridos");
                }

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!userFound) {
                    throw new Error("Credenciales inválidas");
                }

                const matchPassword = await bcrypt.compare(
                    credentials.password,
                    userFound.password
                );

                if (!matchPassword) {
                    throw new Error("Credenciales inválidas");
                }

                return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.name,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}: { token: JWT; user?: any }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}: { session: any; token: JWT }) {
            session.id = token.id;
            if (token.id) {
                const user = await prisma.user.findUnique({
                    where: {id: Number(token.id)},
                });
                session.user = {
                    id: user?.id || "",
                    name: user?.name || "",
                    email: user?.email || "",
                };
            }
            return session;
        },
    },
    secret: process.env.SECRET,

    // Puedes agregar más configuraciones aquí, por ejemplo:
    // callbacks: {},
    // pages: {},
    // session: {},
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
