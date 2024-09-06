import prisma from "@/lib/prisma";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

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
                    throw new Error("Email and password are required");
                }

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!userFound) {
                    throw new Error("No user found with the provided email");
                }

                const matchPassword = await bcrypt.compare(
                    credentials.password,
                    userFound.password
                );

                if (!matchPassword) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.name,
                };
            },
        }),
    ],

    // Puedes agregar más configuraciones aquí, por ejemplo:
    // callbacks: {},
    // pages: {},
    // session: {},
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
