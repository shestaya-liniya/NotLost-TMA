import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import SettingsSectionColorScheme from "@/features/settings/SettingsSectionColorScheme";
import SettingsSectionSupport from "@/features/settings/SettingsSectionSupport";
import SettingsSectionTgSync from "@/features/settings/SettingsSectionTgSync";

export default function Settings() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full px-4"
      style={{ paddingTop: getMiniAppTopInset() }}
    >
      <div className="text-xl font-semibold mt-1 text-link">Settings</div>
      <SettingsSectionColorScheme />
      <SettingsSectionTgSync />
      <SettingsSectionSupport />
    </div>
  );
}
