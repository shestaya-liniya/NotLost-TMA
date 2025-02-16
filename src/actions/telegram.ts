import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TELEGRAM_API_SERVER_ORIGIN,
});

export const $getTelegramEntityByUsername = async (username: string) => {
  return (await axiosInstance.get(`getUserByUsername/${username}`)).data;
};
