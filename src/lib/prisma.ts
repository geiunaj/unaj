import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declaración del objeto global para evitar múltiples instancias en desarrollo
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Asignar prisma a globalThis.prismaGlobal en desarrollo para evitar nuevas instancias
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
