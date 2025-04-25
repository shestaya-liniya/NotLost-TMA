import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { useModalStore } from "@/lib/store/modalStore";
import Tappable from "@/ui/Tappable";

export default function Home() {
  const { setPinDeskOpen } = useModalStore();
  return (
    <div
      className="h-full bg-primary"
      style={{
        paddingTop: getMiniAppTopInset() + 10,
      }}
    >
      <div>
        <Tappable onClick={() => setPinDeskOpen(true)}>Open desk</Tappable>
      </div>
      HELLO
    </div>
  );
}
