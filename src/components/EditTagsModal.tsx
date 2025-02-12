import BottomModal from "@/ui/BottomModal";
import { useModalStore } from "@/lib/store/modal-store";
import { useEffect, useRef, useState } from "react";
import Tappable from "@/ui/Tappable";
import { jazzAddTag } from "@/lib/jazz/actions/jazz-dialog";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Tag from "@/ui/Tag";

export default function EditTagsModal() {
  const { editTagsModalOpen, setEditTagsModalOpen, dialogInfoModalData } =
    useModalStore();
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

  useEffect(() => {
    if (editTagsModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 310);
    }
  }, [editTagsModalOpen]);

  const handleAddTag = () => {
    if (dialogInfoModalData) {
      jazzAddTag(jazzProfile, dialogInfoModalData, {
        title: inputValue,
        color: activeColor,
      });
    }
  };

  return (
    <BottomModal
      id="edit-tags-modal"
      title="Edit tags"
      isOpen={editTagsModalOpen}
      onClose={() => setEditTagsModalOpen(false)}
    >
      <div className="px-4 flex flex-col items-center">
        <div className="flex justify-between items-center w-full pb-2 pl-4 ">
          <div className="text-sm text-hint uppercase self-start ">New tag</div>
          <Tag title={inputValue} color={activeColor} />
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
*/

const ColorCircle = ({
  color,
  activeColor,
  setActiveColor,
}: {
  color: string;
  activeColor: string;
  setActiveColor: (color: string) => void;
}) => {
  return (
    <Tappable
      onClick={() => {
        setActiveColor(color);
      }}
    >
      <div
        className={`w-6 h-6 rounded-full bg-${color} ${activeColor === color ? "border-4 border-link" : ""}`}
      />
    </Tappable>
  );
};
