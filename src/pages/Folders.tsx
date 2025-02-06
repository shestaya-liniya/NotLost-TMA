import Accordion from "@/ui/Accordion";
import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";

export default function Folders(props: { openDialogsModal: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Input label="Folder Name" value="" onInput={() => {}} />
      </div>
      <div className="space-y-4 p-4 mt-4 overflow-y-auto overscroll-none pb-20 max-h-screen">
        <Accordion title="Folder 13">
          <div>Hello</div>
        </Accordion>
        <Accordion title="Folder 2">
          <div>Hello</div>
        </Accordion>
      </div>

      <Tappable
        className="p-3 rounded-full bg-link fixed bottom-10 right-8 z-50"
        onClick={props.openDialogsModal}
      >
        <PencilIcon className="w-7 h-7" />
      </Tappable>
    </div>
  );
}
