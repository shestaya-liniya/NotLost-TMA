import TelegramApiClient from "@/lib/telegram/api/telegram-api-client";
import axios from "axios";
import { TotalList } from "telegram/Helpers";
import { Dialog } from "telegram/tl/custom/dialog";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TELEGRAM_API_SERVER_ORIGIN,
});

const client = TelegramApiClient.getInstance(
  import.meta.env.VITE_TELEGRAM_API_ID,
  import.meta.env.VITE_TELEGRAM_API_HASH,
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

export const $getLoginByQrLink = async () => {
  return client.generateQrLink();
};

export const $getUserByUsername = async (username: string) => {
  return await client.getUserByUsername(username);
};

export const $getMyDialogs = async (): Promise<TotalList<Dialog>> => {
  return await client.getDialogs();
};

export const $getFullChannel = async (channelUsername: string) => {
  return await client.getFullChannel(channelUsername);
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
