import { create } from "zustand";

export interface DraggableItem {
  id: string;
  type: "custom" | "folder" | null;
}

interface DragState {
  draggableItem: DraggableItem | null;
  setDraggableItem: (newState: DraggableItem | null) => void;
}

export const useDragStore = create<DragState>((set) => ({
  draggableItem: null,
  setDraggableItem: (newState) =>
    set(() => ({
      draggableItem: newState,
    })),
}));
