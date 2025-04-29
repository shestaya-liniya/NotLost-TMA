import { create } from "zustand";

interface WorkspaceState {
  nodesDraggable: boolean;
  setNodesDraggable: (newState: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  nodesDraggable: false,
  setNodesDraggable: (newState) =>
    set(() => ({
      nodesDraggable: newState,
    })),
}));
