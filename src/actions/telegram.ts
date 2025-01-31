import TelegramApiClient from "@/lib/telegram/api/telegram-api-client";
// import { validate } from "@telegram-apps/init-data-node";

const API_ID = 1;
const API_HASH = "1";
const STRING_SESSION = "1";

const client = TelegramApiClient.getInstance(
  API_ID,
  API_HASH!,
  STRING_SESSION || ""
);

/* export const $sendCode = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const res = await client.sendSignInCode(ctx.data)
    return res
  })

export const $signIn = createServerFn({ method: "GET" })
  .validator((data: SignInData) => data)
  .handler(async (ctx) => {
    console.log(ctx.data)
    const res = await client.signIn(
      ctx.data.phone,
      ctx.data.password,
      ctx.data.phoneCode,
    )
    return res
  })

export const $validateInitData = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    validate(ctx.data, process.env.TELEGRAM_API_KEY!)
  }) */

export const $getMyDialogs = async (): Promise<DialogData[]> => {
  const res = await client.getDialogs();
  const dialogs = res.map((dialog) => {
    const { name, unreadCount, entity } = dialog;

    return {
      unreadCount,
      name,
      //@ts-ignore
      username: entity.username,
    };
  });
  //@ts-ignore
  return dialogs;
};

/* interface SignInData {
  phone: string
  phoneCode: string
  password: string
} */

export interface DialogData {
  unreadCount: number;
  name: string;
  username: null | string;
}
