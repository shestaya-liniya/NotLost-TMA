import BottomModal from "@/ui/BottomModal";
import { useModalStore } from "@/lib/store/modal-store";
import { useRef, useState } from "react";
import Tappable from "@/ui/Tappable";
import {
  jazzAddTag,
  jazzRemoveTagFromDialog,
} from "@/lib/jazz/actions/jazz-dialog";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Tag from "@/ui/Tag";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { JazzTag } from "@/lib/jazz/schema";
import ColorCircle from "@/ui/ColorCircle";
import useViewportSize from "@/helpers/use-viewport-height";

export default function EditTagsModal() {
  const {
    editTagsModalOpen,
    setEditTagsModalOpen,
    dialogInfoModalDialog: dialog,
    setDialogInfoModalDialog,
  } = useModalStore();
  const { jazzProfile } = useJazzProfileContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
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

  useViewportSize(() => {
    if (editTagsModalOpen) {
      setTimeout(() => {
        window.addEventListener("scroll", (event) => {
          event.preventDefault();
          window.scroll({
            top: 0,
            left: 0,
            behavior: "instant",
          });
        });
        blurInput.current = false;
        inputRef.current?.focus();
        /* let count = 0;
        setInterval(() => {
          if (count < 10) {
            window.scroll({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
            count++;
          }
        }, 100); */
      }, 1000);
    }
  });
  const blurInput = useRef(true);
  inputRef.current?.addEventListener("focus", (event) => {
    if (blurInput.current) {
      event.preventDefault();
      document.getElementById("shadow-input")?.focus();
      inputRef.current?.blur();
    }
  });

  inputRef.current?.addEventListener("blur", () => {
    blurInput.current = true;
  });

  /*   useEffect(() => {
    if (editTagsModalOpen) {
    }
  }, [editTagsModalOpen]); */

  const handleAddTag = () => {
    if (dialog) {
      jazzAddTag(jazzProfile, dialog, {
        title: inputValue,
        color: activeColor,
      });
      setDialogInfoModalDialog(dialog);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tag: JazzTag) => {
    if (dialog) {
      jazzRemoveTagFromDialog(jazzProfile, dialog, tag);
      setDialogInfoModalDialog(dialog);
      inputRef.current?.focus();
    }
  };

  if (!dialog) return null;

  return (
    <BottomModal
      id="edit-tags-modal"
      title="Edit tags"
      isOpen={editTagsModalOpen}
      onClose={() => setEditTagsModalOpen(false)}
    >
      <div className="px-4 flex flex-col items-center">
        {dialog.tags && dialog.tags?.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2 flex-wrap items-start">
              <AnimatePresence>
                {dialog.tags?.map((tag) => {
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
                        className={`flex items-center gap-1 bg-${tag.color}/20 rounded-md pr-1`}
                      >
                        <Tag title={tag.title} color={tag.color} size="md" />
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
          {inputValue.length > 0 && (
            <Tag title={inputValue} color={activeColor} size="md" />
          )}
        </div>

        <input
          ref={inputRef}
          className="appearance-none border-none w-full focus:outline-none focus:ring-transparent bg-secondary rounded-full px-4 py-2"
          type="text"
          placeholder="Tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex flex-row gap-2 mt-2">
          {colors.map((color) => (
            <ColorCircle
              key={color}
              color={color}
              activeColor={activeColor}
              setActiveColor={(color: string) => {
                inputRef.current?.focus();
                setActiveColor(color);
              }}
            />
          ))}
        </div>
        <Tappable
          className="bg-button text-center py-2 mt-4 text-white rounded-xl w-full font-semibold"
          onClick={handleAddTag}
        >
          Add tag
        </Tappable>
      </div>
    </BottomModal>
  );
}

/*
bg-blue-500/20
bg-red-500/20
bg-green-500/20
bg-yellow-500/20
bg-purple-500/20
bg-orange-500/20
bg-pink-500/20
bg-blue-500
bg-red-500
bg-green-500
bg-yellow-500
bg-purple-500
bg-orange-500
bg-pink-500
text-blue-500
text-red-500
text-green-500
text-yellow-500
text-purple-500
text-orange-500
text-pink-500
text-black
*/
