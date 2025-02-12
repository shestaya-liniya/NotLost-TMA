import { create } from "zustand";
import { JazzDialog } from "../jazz/schema";
import { ID } from "jazz-tools";

interface ModalState {
  manageDialogsModalOpen: boolean;
  setManageDialogsModalOpen: (newState: boolean) => void;

  dialogInfoModalOpen: boolean;
  setDialogInfoModalOpen: (newState: boolean) => void;
  dialogInfoModalDialogId: ID<JazzDialog> | null;
  setDialogInfoModalDialogId: (newState: ID<JazzDialog> | null) => void;

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
  dialogInfoModalDialogId: null,
  setDialogInfoModalDialogId: (newState) =>
    set(() => ({
      dialogInfoModalDialogId: newState,
    })),

  editTagsModalOpen: false,
  setEditTagsModalOpen: (newState) =>
    set(() => ({
      editTagsModalOpen: newState,
    })),
}));
