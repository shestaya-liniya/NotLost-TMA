import { create } from "zustand";
import { IGraphFolderFlag, IGraphNodeDialog } from "./Graph.interface";
import { ForceGraphMethods } from "react-force-graph-2d";

interface GraphStore {
  graphRef: React.MutableRefObject<
    ForceGraphMethods<{ id: string | number }> | undefined
  >;

  graphDragMode: boolean;
  setGraphDragMode: (val: boolean) => void;

  graphCooldownTicks: number | undefined;
  setGraphCooldownTicks: (val: number | undefined) => void;

  graphWarmupTicks: number | undefined;
  setGraphWarmupTicks: (val: number | undefined) => void;

  selectedDialog: IGraphNodeDialog | null;
  setSelectedDialog: (dialog: IGraphNodeDialog | null) => void;

  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (val: boolean) => void;

  showFolderFlags: boolean;
  setShowFolderFlags: (val: boolean) => void;

  folderFlags: IGraphFolderFlag[];
  setFolderFlags: (flags: IGraphFolderFlag[]) => void;
}

export const useGraphStore = create<GraphStore>((set) => {
  const graphRef = { current: undefined } as React.MutableRefObject<
    ForceGraphMethods<{ id: string | number }> | undefined
  >;

  return {
    graphRef,
    graphDragMode: false,
    setGraphDragMode: (val) => set({ graphDragMode: val }),

    graphCooldownTicks: 0,
    setGraphCooldownTicks: (val) => set({ graphCooldownTicks: val }),

    graphWarmupTicks: 30,
    setGraphWarmupTicks: (val) => set({ graphWarmupTicks: val }),

    selectedDialog: null,
    setSelectedDialog: (dialog) => set({ selectedDialog: dialog }),

    isSettingsModalOpen: false,
    setIsSettingsModalOpen: (val) => set({ isSettingsModalOpen: val }),

    showFolderFlags: false,
    setShowFolderFlags: (val) => set({ showFolderFlags: val }),

    folderFlags: [],
    setFolderFlags: (val) => set({ folderFlags: val }),
  };
});
