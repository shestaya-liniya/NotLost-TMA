import { create } from "zustand";

interface ModalState {
  manageDialogsModalOpen: boolean;
  setManageDialogsModalOpen: (newState: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  manageDialogsModalOpen: false,
  setManageDialogsModalOpen: (newState) =>
    set(() => ({
      manageDialogsModalOpen: newState,
    })),
}));
