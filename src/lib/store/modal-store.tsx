import { create } from "zustand";
import { JazzDialog } from "../jazz/schema";

interface ModalState {
  manageDialogsModalOpen: boolean;
  setManageDialogsModalOpen: (newState: boolean) => void;

  dialogInfoModalOpen: boolean;
  setDialogInfoModalOpen: (newState: boolean) => void;
  dialogInfoModalData: JazzDialog | null;
  setDialogInfoModalData: (newState: JazzDialog | null) => void;

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
  dialogInfoModalData: null,
  setDialogInfoModalData: (newState) =>
    set(() => ({
      dialogInfoModalData: newState,
    })),

  editTagsModalOpen: false,
  setEditTagsModalOpen: (newState) =>
    set(() => ({
      editTagsModalOpen: newState,
    })),
}));
