import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import Tappable from "../Tappable";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import MoreIcon from "@/assets/icons/more.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import TagIcon from "@/assets/icons/tag.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { useState } from "react";
import FolderAccordionTooltip from "@/features/folders/FolderAccordionTooltip";
import { createPortal } from "react-dom";
import BottomModal from "../modals/BottomModal";
import ColorCircle from "../ColorCircle";
import Input from "../Input";
import Tag from "../Tag";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { JazzDialog, JazzTag } from "@/lib/jazz/schema";
import { getUniqueKey } from "@/helpers/getUniqueKey";
import {
  jazzAddDialog,
  jazzAddTag,
  jazzRemoveTagFromDialog,
} from "@/lib/jazz/actions/jazzDialog";
import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "@/lib/store/modalStore";

function InlineDialog(props: {
  dialog: TelegramDialogInfo | JazzDialog;
  unreadCount: number;
}) {
  const {
    setDialogTooltipPosition,
    setIsDialogTooltipOpen,
    setSelectedDialog,
  } = useModalStore();
  const { dialog, unreadCount } = props;

  const handleActionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setDialogTooltipPosition({
      top: rect.top - 10,
      right: 10,
    });
    setIsDialogTooltipOpen(true);
    setSelectedDialog(dialog);
  };

  return (
    <div className="w-full flex gap-4 px-4 py-3 relative">
      <InlineDialogContent
        dialog={dialog}
        unreadCount={unreadCount}
        handleActionsClick={handleActionsClick}
      />
    </div>
  );
}

function InlineDialogContent(props: {
  dialog: TelegramDialogInfo | JazzDialog;
  unreadCount: number;
  handleActionsClick: (e: React.MouseEvent) => void;
}) {
  const { dialog, unreadCount, handleActionsClick } = props;

  return (
    <div className="w-full flex gap-4 relative">
      <img
        src={getTelegramAvatarLink(dialog.username)}
        className="h-12 w-12 rounded-full"
        alt=""
      />
      <div className="flex-1 flex-col">
        <div className="text-xs font-medium">
          {dialog instanceof JazzDialog ? dialog.name : dialog.label}
        </div>
        <div className="text-link text-xs">@{dialog.username}</div>
        {dialog instanceof JazzDialog && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {dialog.tags
              ?.filter((t) => t !== null)
              .map((t) => (
                <Tag
                  key={getUniqueKey()}
                  title={t?.title}
                  size="sm"
                  color={t.color}
                />
              ))}
          </div>
        )}
        <div className="w-full h-[1px] bg-primary mt-2 absolute -bottom-3 left-16"></div>
      </div>
      {unreadCount > 0 && (
        <div className="rounded-full text-secondary bg-link self-center p-1 min-w-6 text-xs grid place-content-center font-semibold">
          {unreadCount}
        </div>
      )}

      <div className="self-center" onClick={handleActionsClick}>
        <Tappable>
          <MoreIcon className="w-4 h-4 text-link rotate-90" />
        </Tappable>
      </div>
    </div>
  );
}

export function InlineDialogEditTagsModal() {
  const { isEditTagsModalOpen, setIsEditTagsModalOpen, selectedDialog } =
    useModalStore();
  const { jazzProfile } = useJazzProfileContext();

  const [tagValue, setTagValue] = useState("");
  const [activeColor, setActiveColor] = useState<string>("red-500");
  const colors = [
    "red-500",
    "blue-500",
    "green-500",
    "yellow-500",
    "purple-500",
    "orange-500",
    "pink-500",
  ];

  if (!selectedDialog) return;

  const handleAddTag = () => {
    if (!(selectedDialog instanceof JazzDialog) && selectedDialog) {
      jazzAddDialog(jazzProfile, selectedDialog, {
        title: tagValue,
        color: activeColor,
      });
    } else {
      jazzAddTag(jazzProfile, selectedDialog, {
        title: tagValue,
        color: activeColor,
      });
    }
    setTagValue("");
  };

  const handleRemoveTag = (tag: { title: string; color: string }) => {
    if (selectedDialog instanceof JazzDialog) {
      const jazzTag = selectedDialog.tags?.find(
        (t) => t?.title === tag.title && t?.color === tag.color
      );
      if (jazzTag) {
        jazzRemoveTagFromDialog(jazzProfile, selectedDialog, jazzTag);
      }
    }
  };

  return createPortal(
    <BottomModal
      title="Tags"
      id=""
      isOpen={isEditTagsModalOpen}
      onClose={() => setIsEditTagsModalOpen(false)}
    >
      <div className="px-4 flex flex-col items-center">
        {selectedDialog instanceof JazzDialog &&
          selectedDialog.tags &&
          selectedDialog.tags?.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2 flex-wrap items-start">
                <AnimatePresence>
                  {selectedDialog.tags?.map((tag) => {
                    if (!tag) return null;
                    return (
                      <motion.div
                        key={tag.title}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Tappable
                          onClick={() => {
                            handleRemoveTag(tag);
                          }}
                          className={`flex items-center gap-0.5 bg-${tag.color}/20 rounded-md pr-1`}
                        >
                          <Tag
                            title={tag.title}
                            color={tag.color}
                            className={`bg-${tag.color}/5 p-1 px-2`}
                            size="xl"
                          />
                          <RemoveIcon className={`w-3 h-3 text-${tag.color}`} />
                        </Tappable>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        <div className="flex justify-between items-center w-full pb-2 pl-4 ">
          <div className="text-sm text-hint uppercase self-start ">New tag</div>
          {tagValue.length > 0 && (
            <Tag title={tagValue} color={activeColor} size="md" />
          )}
        </div>

        <div className="w-full">
          <Input
            className="bg-secondary"
            label="Tag"
            value={tagValue}
            onInput={(val) => setTagValue(val)}
          />
        </div>
        <div className="flex flex-row gap-2 mt-2">
          {colors.map((color) => (
            <ColorCircle
              key={color}
              color={color}
              activeColor={activeColor}
              setActiveColor={(color: string) => {
                setActiveColor(color);
              }}
            />
          ))}
        </div>
        <Tappable
          onClick={() => handleAddTag()}
          className="bg-button text-center py-2 mt-4 text-white rounded-xl w-full font-semibold"
        >
          Add tag
        </Tappable>
      </div>
    </BottomModal>,
    document.body
  );
}

export function InlineDialogTooltip() {
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

  if (!isDialogTooltipOpen) return;

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
            className="flex gap-0.5 items-center p-2"
          >
            <TagIcon className="h-4 w-4 text-link " />
            <PlusIcon className="text-link h-3.5 w-3.5 self-start scale-110" />
          </Tappable>
          <div className="w-[1px] h-4 bg-link/80"></div>
          <Tappable
            onClick={() => {
              setIsEditTagsModalOpen(true);
              setIsDialogTooltipOpen(false);
            }}
            className="flex gap-0.5 items-center p-2"
          >
            <TagIcon className="h-4 w-4 text-link " />
            <PencilIcon className="text-link h-3 w-3 self-start" />
          </Tappable>
        </div>
        {showAddTagTooltip && (
          <div className=" absolute top-10 left-0 -translate-x-12">
            <div className="max-h-40 backdrop-blur-lg bg-opacity-70 border-link/10 border-[2px] rounded-xl shadow-lg z-30 flex flex-col gap-2 overflow-y-scroll py-2 px-4 bg-secondary items-center">
              {allTags?.map((t) => (
                <Tappable
                  key={getUniqueKey()}
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

export default InlineDialog;
