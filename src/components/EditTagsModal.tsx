import BottomModal from "@/ui/BottomModal";
import { useModalStore } from "@/lib/store/modal-store";
import { useEffect, useRef, useState } from "react";

export default function EditTagsModal() {
  const { editTagsModalOpen, setEditTagsModalOpen } = useModalStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (editTagsModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 310);
    }
  }, [editTagsModalOpen]);

  return (
    <BottomModal
      id="edit-tags-modal"
      title="Edit tags"
      isOpen={editTagsModalOpen}
      onClose={() => setEditTagsModalOpen(false)}
    >
      <div className="p-4 flex flex-col">
        <input
          ref={inputRef}
          className="appearance-none border-none w-full focus:outline-none focus:ring-transparent bg-secondary rounded-full px-4 py-2"
          type="text"
          placeholder="Tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </BottomModal>
  );
}
