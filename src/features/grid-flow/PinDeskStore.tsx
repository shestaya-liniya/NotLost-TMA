import { create } from "zustand";

interface PinDeskState {
  nodesDraggable: boolean;
  setNodesDraggable: (newState: boolean) => void;
}

export const usePinDeskStore = create<PinDeskState>((set) => ({
  nodesDraggable: false,
  setNodesDraggable: (newState) =>
    set(() => ({
      nodesDraggable: newState,
    })),
}));
