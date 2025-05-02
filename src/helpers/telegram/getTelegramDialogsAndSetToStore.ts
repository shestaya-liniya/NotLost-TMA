import { useAppStore } from "@/lib/store/store";
import { telegramActionGetDialogs } from "@/lib/telegram/api/telegramActions";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";

export const getTelegramDialogsAndSetToStore = async () => {
  const { setTelegramDialogs } = useAppStore.getState();
  const tempDialogs: TelegramDialogInfo[] = [];

  await telegramActionGetDialogs().then((dialogs) => {
    dialogs.forEach((d) => {
      if (d.entity?.className === "User") {
        if (!d.entity.username) return;
        const userInfo = {
          label: d.entity.firstName || "X",
          username: d.entity.username || "X",
          id: d.entity.id,
          unreadCount: d.unreadCount,
        };
        tempDialogs.push(userInfo);
      } else if (d.entity?.className === "Channel") {
        if (!d.entity.username) return;
        const userInfo = {
          label: d.entity.title || "X",
          username: d.entity.username || "X",
          id: d.entity.id,
          unreadCount: d.unreadCount,
        };
        tempDialogs.push(userInfo);
      }
    });
  });

  setTelegramDialogs(tempDialogs);
};
