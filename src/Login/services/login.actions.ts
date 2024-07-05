import axios from "axios";

interface LoginFormProps {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginFormProps): Promise<string | null> {
  try {
    console.log('Sending request to /api/auth/index');
    const response = await axios.post<{ token: string }>('/api/auth/index', { email, password });

    console.log('Response status:', response.status);
    if (response.status !== 200) {
      throw new Error('Fallo en el login');
    }

    console.log('Token received:', response.data.token);
    return response.data.token;
  } catch (error: any) {
    console.error('Error logging in:', error.message);
    return null;
  }
}
