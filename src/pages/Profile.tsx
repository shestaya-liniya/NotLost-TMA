import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import Tappable from "@/ui/Tappable";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { useModalStore } from "@/lib/store/modalStore";
import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export default function Profile() {
  const { setSettingsModalOpen } = useModalStore();
  const lp = retrieveLaunchParams();

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{ paddingTop: getMiniAppTopInset() }}
        className="px-4 py-2 bg-secondary border-b-2 border-primary/30"
      >
        <div className="grid grid-cols-3 justify-between mt-2 items-center">
          <Tappable
            onClick={() => setSettingsModalOpen(true)}
            className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
          >
            <SettingsIcon className="h-7 w-7 " />
          </Tappable>
          <div className="text-link font-semibold text-center">Profile</div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <img
          src={getTelegramAvatarLink(lp.tgWebAppData?.user?.username || "")}
          className="h-32 w-32 rounded-full"
          alt=""
        />
        <div className="text-xl font-semibold mt-4">
          {lp.tgWebAppData?.user?.first_name}
        </div>
        <div className="font-semibold text-link">
          @{lp.tgWebAppData?.user?.username}
        </div>
      </div>
    </div>
  );
}
