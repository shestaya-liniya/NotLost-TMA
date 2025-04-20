import { create } from "zustand";

export interface DraggableItem {
  type: "custom" | null;
}

interface DragState {
  draggableItem: DraggableItem | null;
  setDraggableItem: (newState: DraggableItem | null) => void;
}

export const useGridFlowDragStore = create<DragState>((set) => ({
  draggableItem: null,
  setDraggableItem: (newState) =>
    set(() => ({
      draggableItem: newState,
    })),
}));
