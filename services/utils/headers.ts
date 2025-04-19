import { Storage } from "expo-storage";

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await Storage.getItem({ key: "token" });
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};
