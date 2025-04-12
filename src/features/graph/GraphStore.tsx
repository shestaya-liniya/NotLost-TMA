import { create } from "zustand";
import { IGraphFolderFlag } from "./Graph.interface";

interface GraphState {
  folderFlags: IGraphFolderFlag[];
  setFolderFlags: (flags: IGraphFolderFlag[]) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  folderFlags: [],
  setFolderFlags: (flags) =>
    set(() => ({
      folderFlags: flags,
    })),
}));
