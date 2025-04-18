import FolderAccordionTooltip from "@/features/folders/FolderAccordionTooltip";
import { jazzAddDialog, jazzAddTag } from "@/lib/jazz/actions/jazzDialog";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { JazzTag, JazzDialog } from "@/lib/jazz/schema";
import { useModalStore } from "@/lib/store/modalStore";
import { useState, memo } from "react";
import { createPortal } from "react-dom";
import Tag from "../Tag";
import Tappable from "../Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import TagIcon from "@/assets/icons/tag.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";

function InlineDialogTooltip() {
  const {
    isDialogTooltipOpen,
    setIsDialogTooltipOpen,
    dialogTooltipPosition,
    setIsEditTagsModalOpen,
    selectedDialog,
  } = useModalStore();

  const { jazzProfile } = useJazzProfileContext();
  const [showAddTagTooltip, setShowAddTagTooltip] = useState(false);

  const allTags = Array.from(
    new Map(
      jazzProfile.dialogs
        ?.flatMap((d) => d?.tags ?? [])
        .filter((t): t is JazzTag => t != null)
        .map((t) => [`${t.title}:${t.color}`, t])
    ).values()
  );

  return createPortal(
    <FolderAccordionTooltip
      isVisible={isDialogTooltipOpen}
      handleClose={() => {
        setIsDialogTooltipOpen(false);
        setShowAddTagTooltip(false);
      }}
      position={dialogTooltipPosition}
    >
      <div className="relative">
        <div className="flex items-center">
          <Tappable
            onClick={() => {
              setShowAddTagTooltip(true);
            }}
            className="flex gap-0.5 items-center px-4 py-3"
          >
            <TagIcon className="h-5 w-5 text-link " />
            <PlusIcon className="text-link h-4.5 w-4.5 self-start scale-110" />
          </Tappable>
          <div className="w-[2px] rounded-full h-4 bg-link/50"></div>
          <Tappable
            onClick={() => {
              setIsEditTagsModalOpen(true);
              setIsDialogTooltipOpen(false);
            }}
            className="flex gap-0.5 items-center px-4 py-3"
          >
            <TagIcon className="h-5 w-5 text-link " />
            <PencilIcon className="text-link h-4 w-4 self-start" />
          </Tappable>
        </div>
        {showAddTagTooltip && (
          <div className=" absolute top-14 left-4 -translate-x-12">
            <div className="max-h-40 backdrop-blur-lg bg-opacity-70 border-link/10 border-[2px] rounded-xl shadow-lg z-30 flex flex-col gap-2 overflow-y-scroll py-2 px-4 bg-secondary items-center">
              {allTags?.map((t) => (
                <Tappable
                  key={`tag-${t.title}-${t.color}`}
                  className="w-full"
                  onClick={() => {
                    if (!selectedDialog) return;
                    if (!(selectedDialog instanceof JazzDialog)) {
                      jazzAddDialog(jazzProfile, selectedDialog, {
                        title: t.title,
                        color: t.color,
                      });
                    } else {
                      jazzAddTag(jazzProfile, selectedDialog, {
                        title: t.title,
                        color: t.color,
                      });
                    }
                  }}
                >
                  <Tag
                    title={t.title}
                    size="md"
                    color={t.color}
                    className="p-2 min-w-full text-center"
                  />
                </Tappable>
              ))}
            </div>
          </div>
        )}
      </div>
    </FolderAccordionTooltip>,
    document.body
  );
}

export default memo(InlineDialogTooltip);
