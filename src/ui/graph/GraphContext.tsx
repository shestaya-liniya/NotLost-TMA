import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { IGraphFolderFlag, IGraphNodeDialog } from "./Graph.interface";
import { ForceGraphMethods } from "react-force-graph-2d";

interface GraphContextType {
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
  setFolderFlags: React.Dispatch<React.SetStateAction<IGraphFolderFlag[]>>;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const GraphContextProvider = ({ children }: { children: ReactNode }) => {
  const graphRef = useRef<
    ForceGraphMethods<{ id: string | number }> | undefined
  >(undefined);

  const [graphDragMode, setGraphDragMode] = useState(false);
  const [graphCooldownTicks, setGraphCooldownTicks] = useState<
    number | undefined
  >(0);
  const [graphWarmupTicks, setGraphWarmupTicks] = useState<number | undefined>(
    30
  );
  const [selectedDialog, setSelectedDialog] = useState<IGraphNodeDialog | null>(
    null
  );
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showFolderFlags, setShowFolderFlags] = useState(false);
  const [folderFlags, setFolderFlags] = useState<IGraphFolderFlag[]>([]);

  return (
    <GraphContext.Provider
      value={{
        graphRef,
        graphDragMode,
        setGraphDragMode,
        graphCooldownTicks,
        setGraphCooldownTicks,
        graphWarmupTicks,
        setGraphWarmupTicks,
        selectedDialog,
        setSelectedDialog,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        showFolderFlags,
        setShowFolderFlags,
        folderFlags,
        setFolderFlags,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = () =>
  useContext(GraphContext) ??
  (() => {
    throw new Error(
      "useGraphContext must be used within a GraphContextProvider"
    );
  })();
