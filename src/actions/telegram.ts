import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TELEGRAM_API_SERVER_ORIGIN,
});

export const $getTelegramEntityByUsername = async (
  username: string
): Promise<ApiTelegramChannel | ApiTelegramUser> => {
  return (await axiosInstance.get(`getUserByUsername/${username}`)).data;
};

export interface ApiTelegramUser {
  username: string;
  firstName: string | null;
  type: "User";
}

export interface ApiTelegramChannel {
  username: string;
  title: string;
  type: "Channel";
}
