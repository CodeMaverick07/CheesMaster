/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const BACKEND_URL = "https://backend.hemantjatal.me";
// const BACKEND_URL = "http://localhost:3000";
export const LoginHandler = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error logging in:", err);
    return { success: false, message: err.message };
  }
};

export const RegisterHandler = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/register`,
      { email, name, password },
      { withCredentials: true }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error register in:", error);
    return { success: false, message: error.message };
  }
};

export const LogoutHandler = async () => {
  try {
    axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error: any) {
    console.error("Error register in:", error);
    return { success: false, message: error.message };
  }
};

export const validateToken = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/validate`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error validating token:", error);
    return { success: false, message: error.message };
  }
};
