import {
  jazzAddDialog,
  jazzAddTag,
  jazzRemoveTagFromDialog,
} from "@/lib/jazz/actions/jazzDialog";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { JazzDialog } from "@/lib/jazz/schema";
import { useModalStore } from "@/lib/store/modalStore";
import { AnimatePresence, motion } from "framer-motion";
import { useState, memo } from "react";
import { createPortal } from "react-dom";
import ColorCircle from "../ColorCircle";
import Input from "../Input";
import BottomModal from "../modals/BottomModal";
import Tag from "../Tag";
import Tappable from "../Tappable";
import RemoveIcon from "@/assets/icons/remove.svg?react";

function InlineDialogEditTagsModal() {
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

export default memo(InlineDialogEditTagsModal);
