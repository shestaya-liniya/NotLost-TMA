import { ReactNode } from "react";

export default function SettingsOneLineSection(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="rounded-2xl items-center bg-secondary px-6 py-4 w-full font-semibold flex mt-4">
      {children}
    </div>
  );
}
