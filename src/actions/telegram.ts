import TelegramApiClient from "@/lib/telegram/api/telegram-api-client";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TELEGRAM_API_SERVER_ORIGIN,
});

const client = TelegramApiClient.getInstance(
  21895764,
  "b827c12729691cee0f2c5b044d582804",
  localStorage.getItem("session")
    ? JSON.parse(localStorage.getItem("session")!)
    : ""
);

export const $sendCode = async (phoneNumber: string) => {
  client.sendSignInCode(phoneNumber);
};

export const $signIn = async (
  phoneNumber: string,
  phoneCode: string,
  password: string
) => {
  client.signIn(phoneNumber, password, phoneCode);
};

export const $getUserByUsername = async (username: string) => {
  return await client.getUserByUsername(username);
};

export const $getMyDialogs = async () => {
  return await client.getDialogs();
};

export const $getFolders = async () => {
  return await client.getFoldersAndDialogUsernames();
};

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
