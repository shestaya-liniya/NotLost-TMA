import { create } from "zustand";

interface ModalState {
  manageDialogsModalOpen: boolean;
  manageDialogsModalHeight: number;

  setManageDialogsModalOpen: (newState: boolean) => void;
  setManageDialogsModalHeight: (newHeight: number) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  manageDialogsModalOpen: false,
  manageDialogsModalHeight: 0,
  setManageDialogsModalOpen: (newState) =>
    set(() => ({
      manageDialogsModalOpen: newState,
    })),
  setManageDialogsModalHeight: (newHeight) =>
    set(() => ({
      manageDialogsModalHeight: newHeight,
    })),
}));
