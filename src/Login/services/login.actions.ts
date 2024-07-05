import axios from "axios";

interface LoginFormProps {
  email: string;
  password: string;
}

export async function loginUser({
  email,
  password,
}: LoginFormProps): Promise<string | null> {
  try {
    const data: LoginFormProps = {
      email,
      password,
    };

    const response = await axios.post("/api/auth", data);

    console.log("Response status:", response.status);
    if (response.status !== 200) {
      throw new Error("Fallo en el login");
    }

    console.log("Token received:", response.data);
    return response.data.token;
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    return null;
  }
}
