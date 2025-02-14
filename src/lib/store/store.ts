import { create } from "zustand";
import { JazzFolder } from "../jazz/schema";

interface AppState {
  expandedFolder: JazzFolder | null;
  setExpandedFolder: (expandedFolder: JazzFolder | null) => void;

  shadowInputValue: string;
  setShadowInputValue: (shadowInputValue: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  expandedFolder: null,
  setExpandedFolder: (expandedFolder) =>
    set(() => ({
      expandedFolder: expandedFolder,
    })),
  shadowInputValue: "",
  setShadowInputValue: (shadowInputValue) =>
    set(() => ({
      shadowInputValue: shadowInputValue,
    })),
}));
