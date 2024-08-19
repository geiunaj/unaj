// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { User } from "@prisma/client";

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const type_userId = searchParams.get("type_userId") ?? undefined;

//     const page = parseInt(searchParams.get("page") ?? "1");
//     const perPage = parseInt(searchParams.get("perPage") ?? "10");

//   let type_user_id;
//         if (type_userId) {
//             const anioRecord = await prisma.typeUser.findFirst({
//                 where: {
//                     type_name: type_userId,
//                 },
//             });
//             type_user_id = anioRecord ? anioRecord.id : undefined;
//         }

//         // const whereOptions = {
//         //     type_user_id: type_user_id,
//         // };

//         // const totalRecords = await prisma.combustible.count({where: whereOptions});
//         // const totalPages = Math.ceil(totalRecords / perPage);

//         // const user = await prisma.user.findMany({
//         //     where: 
//         //     include: {
//         //         type_user: true,
//         //     },
//         //     // orderBy: sort
//         //     //     ? [{[sort]: direction || 'desc'}]
//         //     //     : [
//         //     //         {anio_id: 'desc'},
//         //     //         {mes_id: 'desc'}
//         //     //     ],
//         //     skip: (page - 1) * perPage,
//         //     take: perPage,
//         // });

//         const formattedCombustibles: User[] = combustibles.map(
//             (user) => formatCombustible(combustible)
//         );

//         return NextResponse.json({
//             data: formattedCombustibles,
//             meta: {
//                 page,
//                 perPage,
//                 totalRecords,
//                 totalPages,
//             },
//         });
//     } catch (error) {
//         console.error("Error buscando consumos", error);
//         return new NextResponse("Error buscando consumos", {status: 500});
//     }
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     const body = await req.json();
//     const { nombre, porcentajeNitrogeno, unidad, clase } = body;
//     if (
//       !nombre ||
//       !porcentajeNitrogeno ||
//       !unidad ||
//       !clase
//     ) {
//       return new NextResponse("Missing or invalid required fields", { status: 400 });
//     }

//     const tipoFertilizante = await prisma.tipoFertilizante.create({
//       data: {
//         nombre,
//         porcentajeNitrogeno,
//         unidad,
//         clase,
//       },
//     });

    
//     return NextResponse.json({
//       message: "Tipo de Fertilizante creado",
//       tipoFertilizante: tipoFertilizante,
//   });

//   } catch (error) {
//     console.error("Error creating tipo de fertilizante", error);
//     return new NextResponse("Error creating tipo de fertilizante", { status: 500 });
//   }
// }