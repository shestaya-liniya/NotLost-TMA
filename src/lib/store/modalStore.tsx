import { create } from "zustand";
import { JazzDialog, JazzFolder } from "../jazz/schema";

interface ModalState {
  manageDialogsModalOpen: boolean;
  setManageDialogsModalOpen: (newState: boolean) => void;

  dialogInfoModalOpen: boolean;
  setDialogInfoModalOpen: (newState: boolean) => void;
  dialogInfoModalDialog: JazzDialog | null;
  setDialogInfoModalDialog: (newState: JazzDialog | null) => void;

  editTagsModalOpen: boolean;
  setEditTagsModalOpen: (newState: boolean) => void;

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

  workspaceOpen: boolean;
  setWorkspaceOpen: (newState: boolean) => void;
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

  editTagsModalOpen: false,
  setEditTagsModalOpen: (newState) =>
    set(() => ({
      editTagsModalOpen: newState,
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

  workspaceOpen: false,
  setWorkspaceOpen: (newState) =>
    set(() => ({
      workspaceOpen: newState,
    })),
}));
