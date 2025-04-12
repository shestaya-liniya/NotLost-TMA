import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import SettingsSectionColorScheme from "@/features/settings/SettingsSectionColorScheme";
import SettingsSectionSupport from "@/features/settings/SettingsSectionSupport";
import SettingsSectionTgSync from "@/features/settings/SettingsSectionTgSync";

export default function Settings() {
  return (
    <div>
      <div
        style={{ paddingTop: getMiniAppTopInset() }}
        className="px-4 py-2 bg-secondary border-b-2 border-primary/30 w-full"
      >
        <div className="relative flex mt-2 items-center justify-center h-[48px]">
          <div className="text-link font-semibold">Settings</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full px-4">
        <SettingsSectionColorScheme />
        <SettingsSectionTgSync />
        <SettingsSectionSupport />
      </div>
    </div>
  );
}
