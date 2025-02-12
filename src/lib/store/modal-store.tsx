import { create } from "zustand";
import { JazzDialog } from "../jazz/schema";

interface ModalState {
  manageDialogsModalOpen: boolean;
  setManageDialogsModalOpen: (newState: boolean) => void;

  dialogInfoModalOpen: boolean;
  setDialogInfoModalOpen: (newState: boolean) => void;
  dialogInfoModalDialog: JazzDialog | null;
  setDialogInfoModalDialog: (newState: JazzDialog | null) => void;

  editTagsModalOpen: boolean;
  setEditTagsModalOpen: (newState: boolean) => void;
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
}));
