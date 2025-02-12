export default function Tag({
  title,
  color,
  size = "sm",
}: {
  title: string;
  color: string;
  size?: "sm" | "md" | "xl";
}) {
  const sizeClass =
    size === "sm"
      ? "rounded-sm text-[8px]"
      : size === "md"
        ? "rounded-sm text-[10px]"
        : "rounded-sm text-[12px]";

  return (
    <div
      className={`bg-${color}/20 ${sizeClass} text-${color} font-bold px-1 py-0.5 uppercase inline-block`}
    >
      {title}
    </div>
  );
}
