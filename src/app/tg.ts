import { useAppStore } from "@/lib/store/store";
import { telegramActionGetDialogs } from "@/lib/telegram/api/telegramActions";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

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
        };
        tempDialogs.push(userInfo);
      } else if (d.entity?.className === "Channel") {
        if (!d.entity.username) return;
        const userInfo = {
          label: d.entity.title || "X",
          username: d.entity.username || "X",
          id: d.entity.id,
        };
        tempDialogs.push(userInfo);
      }
    });
  });

  setTelegramDialogs(tempDialogs);
};

export const setupTelegramTheme = (): void => {
  const lp = retrieveLaunchParams();
  const tp = lp.tgWebAppThemeParams;

  const style = document.createElement("style");
  style.innerHTML = `:root { 
    --tg-bg-color: ${tp.bg_color};
    --tg-theme-secondary-bg-color: ${tp.secondary_bg_color};
    --tg-theme-link-color: ${tp.link_color};
    --tg-theme-accent-text-color: ${tp.accent_text_color};
    --tg-theme-hint-color: ${tp.hint_color};
    --tg-theme-button-color: ${tp.button_color};
    --tg-theme-text-color: ${tp.text_color};
    ${["macos", "tdesktop"].includes(lp.tgWebAppPlatform) && "--tg-viewport-safe-area-inset-top: 20px; --tg-viewport-content-safe-area-inset-top: 20px"}
  }`;
  document.head.appendChild(style);
};
