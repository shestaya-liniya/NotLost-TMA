import { create } from "zustand";

interface WorkspaceModalsStore {
  showTopMenu: boolean;
  showPinModal: boolean;
  showFolderPinModal: boolean;

  actions: WorkspaceModalsActions;
}

interface WorkspaceModalsActions {
  setShowTopMenu: (newState: boolean) => void;
  setShowPinModal: (newState: boolean) => void;
  setShowFolderPinModal: (newState: boolean) => void;
}

export const useWorkspaceModalsStore = create<WorkspaceModalsStore>((set) => ({
  showTopMenu: false,
  showPinModal: false,
  showFolderPinModal: false,

  actions: {
    setShowTopMenu: (newState) =>
      set(() => ({
        showTopMenu: newState,
      })),

    setShowPinModal: (newState) =>
      set(() => ({
        showPinModal: newState,
      })),

    setShowFolderPinModal: (newState) =>
      set(() => ({
        showFolderPinModal: newState,
      })),
  },
}));

export const useWorkspaceModalsActions = () =>
  useWorkspaceModalsStore((state) => state.actions);
