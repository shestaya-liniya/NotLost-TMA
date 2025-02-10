import Tappable from "./Tappable";

export default function InlineButton({
  title,
  onClick,
  Icon,
}: {
  title: string;
  onClick: () => void;
  Icon: React.ReactNode;
}) {
  return (
    <Tappable
      className="px-4 py-2 flex flex-col gap-1 text-link justify-center items-center flex-1"
      onClick={onClick}
    >
      {Icon}
      <div className="text-sm font-medium">{title}</div>
    </Tappable>
  );
}
