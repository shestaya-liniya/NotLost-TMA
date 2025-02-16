import { useModalStore } from "@/lib/store/modal-store";
import Input from "@/ui/Input";
import Modal from "@/ui/Modal";

export default function AddDialogModal() {
  const { addDialogModalOpen, setAddDialogModalOpen } = useModalStore();
  return (
    <Modal
      isOpen={addDialogModalOpen}
      onClose={() => setAddDialogModalOpen(false)}
      title="Add dialog"
    >
      <div>
        <Input label="g" value="hello" onInput={() => {}} />
      </div>
    </Modal>
  );
}
