import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import SettingsSectionSupport from "@/features/settings/SettingsSectionSupport";
import SettingsSectionTgSync from "@/features/settings/SettingsSectionTgSync";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";

export default function Settings() {
  return (
    <div
      style={{
        marginTop: getMiniAppTopInset(),
      }}
    >
      <MiniAppTopButton onClick={() => {}}>
        <div className="flex items-center gap-2">Settings</div>
      </MiniAppTopButton>
      <div className="flex flex-col items-center justify-center w-full px-4">
        <SettingsSectionTgSync />
        <SettingsSectionSupport />
      </div>
    </div>
  );
}
