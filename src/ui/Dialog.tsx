import { truncateWord } from "@/helpers/truncate-word";
import Tappable from "./Tappable.jsx";

export default function Dialog(props: { name: string; username: string }) {
  return (
    <Tappable
      className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 relative"
      onClick={() => {
        window.open(`https://t.me/${props.username}`);
      }}
    >
      <img
        loading="lazy"
        src={`https://t.me/i/userpic/320/${props.username}.svg`}
        className="h-12 w-12 rounded-full"
        decoding="async"
        alt=""
      />
      <span
        className={`px-2 py-[0.5px] text-xs font-normal bg-link/10 text-link rounded-xl`}
      >
        {truncateWord(props.name || "", 5)}
      </span>
    </Tappable>
  );
}
