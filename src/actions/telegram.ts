import { getTelegramSession } from "@/helpers/telegram/telegramSession";
import TelegramApiClient from "@/lib/telegram/api/telegram-api-client";
import axios from "axios";
import { TotalList } from "telegram/Helpers";
import { Dialog } from "telegram/tl/custom/dialog";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TELEGRAM_API_SERVER_ORIGIN,
});
console.log(Number(import.meta.env.VITE_TELEGRAM_API_ID));

const client = TelegramApiClient.getInstance(
  Number(import.meta.env.VITE_TELEGRAM_API_ID),
  import.meta.env.VITE_TELEGRAM_API_HASH,
  getTelegramSession() ? JSON.parse(getTelegramSession()!) : ""
);

export const $sendCode = async (phoneNumber: string) => {
  return await client.sendSignInCode(phoneNumber);
};

export const $signIn = async (
  phoneNumber: string,
  phoneCode: string,
  password: string,
  onSuccess: (session: string) => void
) => {
  return await client.signIn(phoneNumber, password, phoneCode, onSuccess);
};

export const $signInWithPassword = async (
  password: string,
  onSuccess: (session: string) => void
) => {
  return await client.signInWithPassword(password, onSuccess);
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
  return await axiosInstance
    .get(`getUserByUsername/${username}`)
    .then((res) => {
      return res.data;
    })
    .catch(() => null);
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
