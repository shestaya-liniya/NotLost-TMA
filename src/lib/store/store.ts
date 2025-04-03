import { create } from "zustand";
import { JazzFolder } from "../jazz/schema";
import { TelegramDialogInfo } from "../telegram/api/telegram-api-client";

interface AppState {
  expandedFolder: JazzFolder | null;
  setExpandedFolder: (expandedFolder: JazzFolder | null) => void;

  shadowInputValue: string;
  setShadowInputValue: (shadowInputValue: string) => void;

  telegramDialogs: TelegramDialogInfo[];
  setTelegramDialogs: (dialogs: TelegramDialogInfo[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  expandedFolder: null,
  setExpandedFolder: (expandedFolder) =>
    set(() => ({
      expandedFolder: expandedFolder,
    })),

  shadowInputValue: "",
  setShadowInputValue: (shadowInputValue) =>
    set(() => ({
      shadowInputValue: shadowInputValue,
    })),

  telegramDialogs: [],
  setTelegramDialogs: (dialogs) =>
    set(() => ({
      telegramDialogs: dialogs,
    })),
}));
