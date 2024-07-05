import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const SECRET_KEY = "mysecretkey";

export default async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  console.log("Request received with email:", email);
  console.log("Password:", password);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalido email o contraseña" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalido email o contraseña" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}
