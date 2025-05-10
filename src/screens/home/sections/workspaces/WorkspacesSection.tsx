import HorizontalScrollableList from "@/ui/HorizontalScrollableList";
import WorkspaceCard from "./WorkspaceCard";
import WorkspaceCardNew from "./WorkspaceCardNew";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { memo } from "react";

function WorkspacesSection() {
  const { jazzProfile } = useJazzProfileContext();

  return (
    <div>
      <div>
        <div className="text-[#D4D4D4] font-medium flex gap-1 items-center ml-2">
          <div className="text-xs">All workspaces</div>
        </div>
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
