import { getMiniAppTopInset } from "@/helpers/css/get-top-tg-inset";
import SettingsSectionColorScheme from "@/ui/settings/SettingsSectionColorScheme";
import SettingsSectionTgSync from "@/ui/settings/SettingsSectionTgSync";

export default function Settings() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full px-4"
      style={{ paddingTop: getMiniAppTopInset() }}
    >
      <div className="text-xl font-semibold mt-1 text-link">Settings</div>
      <SettingsSectionColorScheme />
      <SettingsSectionTgSync />
    </div>
  );
}
