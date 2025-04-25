import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { useModalStore } from "@/lib/store/modalStore";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";
import Tappable from "@/ui/Tappable";

export default function Home() {
  const { setPinDeskOpen } = useModalStore();
  return (
    <div className="h-screen relative">
      <MiniAppTopButton>
        <Tappable className="max-h-[32px] h-[32px] text-sm backdrop-blur-[25px] bg-button rounded-2xl px-3 py-1.5 font-medium flex items-center gap-2 border-[1px] border-[#252525]">
          NotLost
        </Tappable>
      </MiniAppTopButton>
      <div
        style={{
          paddingTop: getMiniAppTopInset() + 10,
        }}
      >
        <Tappable onClick={() => setPinDeskOpen(true)}>PIN DESK</Tappable>
      </div>
    </div>
  );
}
