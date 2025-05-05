import { JazzWorkspace } from "@/lib/jazz/schema";
import { create } from "zustand";

interface WorkspaceState {
  activeWorkspace: JazzWorkspace | null;
  moveModeEnabled: boolean;
  unpinModeEnabled: boolean;
  actions: WorkspaceActions;
}

interface WorkspaceActions {
  setActiveWorkspace: (newState: JazzWorkspace) => void;
  setMoveModeEnabled: (newState: boolean) => void;
  setUnpinModeEnabled: (newState: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: null,
  moveModeEnabled: false,
  unpinModeEnabled: false,

  actions: {
    setActiveWorkspace: (newState) =>
      set(() => ({
        activeWorkspace: newState,
      })),
    setMoveModeEnabled: (newState) =>
      set(() => ({
        moveModeEnabled: newState,
      })),
    setUnpinModeEnabled: (newState) =>
      set(() => ({
        unpinModeEnabled: newState,
      })),
  },
}));

export const useWorkspaceActions = () =>
  useWorkspaceStore((state) => state.actions);
