import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";

export default function CustomNode() {
  return (
    <div
      className="relative top-[3px] left-[3px]"
      style={{
        transition: "transform 0.2s ease",
      }}
    >
      <img
        src={getTelegramAvatarLink("shestaya_liniya")}
        className="h-18 w-18 rounded-full"
        alt=""
      />
    </div>
  );
}
