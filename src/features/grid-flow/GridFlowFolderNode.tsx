import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";

export default function GridFlowFolderNode() {
  return (
    <div className="w-38 h-18 bg-primary rounded-xl flex flex-col items-center relative overflow-hidden border-[1px] border-secondary">
      <div className="flex relative left-2 mt-1">
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="h-8 w-8 rounded-full"
        />
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="h-8 w-8 rounded-full relative right-2"
        />
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="h-8 w-8 rounded-full relative right-4"
        />
      </div>
      <div className="text-xs font-medium mt-2 bg-secondary w-full absolute bottom-0 left-0 pt-1.5 pb-1.5 px-4 text-white flex justify-between">
        <div className="uppercase text-[8px] tracking-widest font-semibold">
          Folder
        </div>
      </div>
      <div className="absolute top-1 right-1 bg-red-500 rounded-full text-xs h-3 w-3 text-[9px] grid place-items-center">
        4
      </div>
    </div>
  );
}
