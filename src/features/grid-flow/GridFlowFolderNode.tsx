import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import FolderIcon from "@/assets/icons/folder.svg?react";

export default function GridFlowFolderNode() {
  return (
    <div className="w-38 h-18 bg-primary rounded-xl flex flex-col items-center relative overflow-hidden border-[1px] border-secondary">
      <div className="text-xs font-medium mt-2  w-full absolute top-0 left-0 pb-1.5 px-4 text-white flex items-center gap-1">
        <FolderIcon className="w-4 h-4 text-secondary" />
        <div className="tracking-widest text-[10px] text-[#d4d4d4]">Folder</div>
      </div>
      <div className="flex relative left-2 mt-8">
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="h-8 w-8 rounded-full"
        />
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="h-8 w-8 rounded-full relative -left-2"
        />
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="h-8 w-8 rounded-full relative -left-4"
        />
      </div>

      {/* <div className="absolute top-1 right-1 bg-red-500 rounded-full text-xs h-3 w-3 text-[9px] grid place-items-center">
        4
      </div> */}
    </div>
  );
}
