import { JazzWorkspace } from "@/lib/jazz/schema";
import { create } from "zustand";

interface WorkspaceState {
  activeWorkspace: JazzWorkspace | null;
  setActiveWorkspace: (newState: JazzWorkspace) => void;

  nodesDraggable: boolean;
  setNodesDraggable: (newState: boolean) => void;

  deleteModeEnabled: boolean;
  setDeleteModeEnabled: (newState: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: null,
  setActiveWorkspace: (newState) =>
    set(() => ({
      activeWorkspace: newState,
    })),

  nodesDraggable: false,
  setNodesDraggable: (newState) =>
    set(() => ({
      nodesDraggable: newState,
    })),

  deleteModeEnabled: false,
  setDeleteModeEnabled: (newState) =>
    set(() => ({
      deleteModeEnabled: newState,
    })),
}));
