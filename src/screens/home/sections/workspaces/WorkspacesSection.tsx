import { JazzListOfWorkspaces } from "@/lib/jazz/schema";
import HorizontalScrollableList from "@/ui/HorizontalScrollableList";
import Tappable from "@/ui/Tappable";
import WorkspaceCard from "./WorkspaceCard";
import WorkspaceCardNew from "./WorkspaceCardNew";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useModalStore } from "@/lib/store/modalStore";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import { memo } from "react";

function WorkspacesSection() {
  const { jazzProfile } = useJazzProfileContext();
  const { setWorkspaceOpen } = useModalStore();

  return (
    <div>
      <Tappable
        onTap={() => {
          jazzProfile.workspaces = JazzListOfWorkspaces.create([]);
        }}
      >
        Clear workspaces
      </Tappable>
      <div>
        <Tappable
          onTap={() => setWorkspaceOpen(true)}
          className="text-[#D4D4D4] font-medium flex gap-1 items-center ml-2"
        >
          <div className="text-xs">All workspaces</div>
          <ChevronRightIcon className="h-2 w-2 mt-0.5" />
        </Tappable>
        <HorizontalScrollableList className="-ml-4 -mr-4 px-4 pt-3">
          {jazzProfile.workspaces
            ?.filter((w) => w !== null)
            .map((w) => (
              <li key={w.id}>
                <WorkspaceCard workspace={w} />
              </li>
            ))}

          <li>
            <WorkspaceCardNew />
          </li>
        </HorizontalScrollableList>
      </div>
    </div>
  );
}

export default memo(WorkspacesSection);
