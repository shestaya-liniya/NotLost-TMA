import { twMerge } from "tailwind-merge";

export default function Tag({
  title,
  color,
  size = "sm",
  className,
}: {
  title: string;
  color: string;
  size?: "sm" | "md" | "xl";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "rounded-sm text-[8px]"
      : size === "md"
        ? "rounded-sm text-[10px]"
        : "rounded-sm text-[12px]";

  return (
    <div
      className={twMerge(
        `bg-primary ${sizeClass} text-${color} font-bold px-1 py-0.5 uppercase inline-block leading-3`,
        className
      )}
    >
      {title}
    </div>
  );
}
