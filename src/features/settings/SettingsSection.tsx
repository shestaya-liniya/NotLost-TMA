import { ReactNode } from "react";

export default function SettingsSection(props: {
  Icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const { Icon, title, children } = props;
  return (
    <div>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 w-full font-semibold flex gap-4 mt-4`}
      >
        {Icon}
        {title}
      </div>
      <div className="bg-secondary border-l-2 border-r-2 border-b-2 rounded-bl-2xl rounded-br-2xl border-primary/30 p-4 w-full">
        {children}
      </div>
    </div>
  );
}
