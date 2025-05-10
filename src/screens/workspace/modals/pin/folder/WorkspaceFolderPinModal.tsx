import BottomModal from "@/ui/modals/BottomModal";
import { memo } from "react";
import {
  useWorkspaceModalsActions,
  useWorkspaceModalsStore,
} from "../../../.store/WorkspaceModals.store";
import { useWorkspaceStore } from "../../../.store/Workspace.store";
import WorkspaceFolderPinModalChats from "./WorkspaceFolderPinModalChats";

function WorkspaceFolderPinModal() {
  const { setShowFolderPinModal } = useWorkspaceModalsActions();
  const openedFolder = useWorkspaceStore((s) => s.openedFolder);
  const showFolderPinModal = useWorkspaceModalsStore(
    (s) => s.showFolderPinModal
  );

  return (
    <BottomModal
      id="workspace-add-moda-folder"
      isOpen={showFolderPinModal}
      onClose={() => setShowFolderPinModal(false)}
      title={"Add to " + openedFolder?.data.title}
    >
      <WorkspaceFolderPinModalChats />
    </BottomModal>
  );
}

export default memo(WorkspaceFolderPinModal);
