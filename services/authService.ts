import { BACKURL } from "@/api/backurl";

const handleResponseToken = async (response: Response) => {
  const data = await response.json();
    
  if (!response.ok || !data.success) {
    throw new Error(data.error || `Error: ${response.statusText}`);
  }
  return data.data.token;
};

export const authService = {
  async login(username: string, password: string) {
    const res = await fetch(`${BACKURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponseToken(res);
  },
};
