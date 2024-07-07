// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const SECRET_KEY = "mysecretkey";

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany();
//     return NextResponse.json({ success: true, data: users });
//   } catch (error: any) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json(
//       { success: false, message: `Error fetching users: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   const data = await request.json();
//   const { email, password } = data;

//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         email: email,
//       },
//     });

//     console.log("User:", user);

//     if (!user) {
//       console.log("User not found");
//       return NextResponse.json({ message: "Invalido email o contraseña" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     console.log("Password valid:", isPasswordValid);

//     if (!isPasswordValid) {
//       console.log("Invalid password");
//       return NextResponse.json({ message: "Invalido email o contraseña" });
//     }

//     const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
//     NextResponse.json({ token });
//   } catch (error) {
//     console.error("Error durante el login:", error);
//     return NextResponse.json({ message: "Error durante el login" });
//   }
// }
