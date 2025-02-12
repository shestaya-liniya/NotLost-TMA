export default function Tag({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  return (
    <div
      className={`bg-${color}/20 h-3.5 rounded-sm text-[8px] text-${color} px-1 flex items-center gap-1 py-1 uppercase`}
    >
      {title}
    </div>
  );
}
