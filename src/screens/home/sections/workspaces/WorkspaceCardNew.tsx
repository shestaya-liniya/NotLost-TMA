import { jazzCreateWorkspace } from "@/lib/jazz/actions/jazzWorkspace";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import Tappable from "@/ui/Tappable";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { memo } from "react";

function WorkspaceCardNew() {
  const { jazzProfile } = useJazzProfileContext();
  return (
    <Tappable
      onClick={() => jazzCreateWorkspace(jazzProfile)}
      className="w-40 h-30 rounded-2xl relative bg-secondary border-[1px] border-secondary grid place-content-center"
    >
      <div className="text-hint text-xs flex gap-1">
        <PlusIcon className="w-4 h-4" />
        <div>New workspace</div>
      </div>
    </Tappable>
  );
}

export default memo(WorkspaceCardNew);
