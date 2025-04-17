import { create } from "zustand";
import { JazzDialog, JazzFolder } from "../jazz/schema";
import { TelegramDialogInfo } from "../telegram/api/telegramApiClient";

interface TooltipPosition {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}
interface ModalState {
  manageDialogsModalOpen: boolean;
  setManageDialogsModalOpen: (newState: boolean) => void;

  dialogInfoModalOpen: boolean;
  setDialogInfoModalOpen: (newState: boolean) => void;
  dialogInfoModalDialog: JazzDialog | null;
  setDialogInfoModalDialog: (newState: JazzDialog | null) => void;

  isEditTagsModalOpen: boolean;
  setIsEditTagsModalOpen: (newState: boolean) => void;
  selectedDialog: TelegramDialogInfo | JazzDialog | null;
  setSelectedDialog: (newState: TelegramDialogInfo | JazzDialog) => void;

  isDialogTooltipOpen: boolean;
  setIsDialogTooltipOpen: (newState: boolean) => void;
  dialogTooltipPosition: TooltipPosition | null;
  setDialogTooltipPosition: (newState: TooltipPosition) => void;

  addDialogModalOpen: boolean;
  setAddDialogModalOpen: (newState: boolean) => void;
  addDialogModalFolder: JazzFolder | null;
  setAddDialogModalFolder: (newState: JazzFolder | null) => void;

  // Sliding modals
  isSlidingModalOpen: boolean;
  setIsSlidingModalOpen: (newState: boolean) => void;

  telegramSignInModalOpen: boolean;
  setTelegramSignInModalOpen: (newState: boolean) => void;

  settingsModalOpen: boolean;
  setSettingsModalOpen: (newState: boolean) => void;

  graphModalOpen: boolean;
  setGraphModalOpen: (newState: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  manageDialogsModalOpen: false,
  setManageDialogsModalOpen: (newState) =>
    set(() => ({
      manageDialogsModalOpen: newState,
    })),

  dialogInfoModalOpen: false,
  setDialogInfoModalOpen: (newState) =>
    set(() => ({
      dialogInfoModalOpen: newState,
    })),
  dialogInfoModalDialog: null,
  setDialogInfoModalDialog: (newState) =>
    set(() => ({
      dialogInfoModalDialog: newState,
    })),

  isEditTagsModalOpen: false,
  setIsEditTagsModalOpen: (newState) =>
    set(() => ({
      isEditTagsModalOpen: newState,
    })),
  selectedDialog: null,
  setSelectedDialog: (newState) =>
    set(() => ({
      selectedDialog: newState,
    })),

  isDialogTooltipOpen: false,
  setIsDialogTooltipOpen: (newState) =>
    set(() => ({
      isDialogTooltipOpen: newState,
    })),
  dialogTooltipPosition: null,
  setDialogTooltipPosition: (newState) =>
    set(() => ({
      dialogTooltipPosition: newState,
    })),

  addDialogModalOpen: false,
  setAddDialogModalOpen: (newState) =>
    set(() => ({
      addDialogModalOpen: newState,
    })),
  addDialogModalFolder: null,
  setAddDialogModalFolder: (newState) =>
    set(() => ({
      addDialogModalFolder: newState,
    })),

  isSlidingModalOpen: false,
  setIsSlidingModalOpen: (newState) =>
    set(() => ({
      isSlidingModalOpen: newState,
    })),

  telegramSignInModalOpen: false,
  setTelegramSignInModalOpen: (newState) =>
    set(() => ({
      telegramSignInModalOpen: newState,
    })),

  settingsModalOpen: false,
  setSettingsModalOpen: (newState) =>
    set(() => ({
      settingsModalOpen: newState,
    })),

  graphModalOpen: false,
  setGraphModalOpen: (newState) =>
    set(() => ({
      graphModalOpen: newState,
    })),
}));
