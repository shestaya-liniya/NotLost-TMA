import Tappable from "../../ui/Tappable";
import SettingsOneLineSection from "./SettingsOneLineSection";
import QuestionCircleIcon from "@/assets/icons/question.svg?react";

export default function SettingsSectionSupport() {
  return (
    <SettingsOneLineSection>
      <div className="flex gap-4 flex-1 items-center">
        <QuestionCircleIcon className="w-7 h-7 text-[#d4d4d4]" />
        Support
      </div>
      <div>
        <Tappable
          className="bg-primary rounded-xl px-4 py-1"
          onClick={() => window.open("https://t.me/shestaya_liniya")}
        >
          Message
        </Tappable>
      </div>
    </SettingsOneLineSection>
  );
}
