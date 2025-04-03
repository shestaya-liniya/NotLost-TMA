import { create } from "zustand";

export interface DraggableItem {
  name: string;
  username: string | null;
}

interface DragState {
  draggableItemType: "folder" | "contact" | null;
  draggableItem: null | DraggableItem;
  setDragState: (newState: {
    draggableItemType: "folder" | "contact" | null;
    draggableItem?: DraggableItem | null;
  }) => void;
}

export const useDragStore = create<DragState>((set) => ({
  draggableItemType: null,
  draggableItem: null,
  setDragState: (newState) =>
    set(() => ({
      draggableItemType: newState.draggableItemType,
      draggableItem: newState.draggableItem,
    })),
}));
