import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";

export default function CustomNode({ data }: { data: { username: string } }) {
  return (
    <div className="relative custom-node">
      <img
        src={getTelegramAvatarLink(data.username)}
        className="h-18 w-18 rounded-full"
        alt=""
      />
      <div className="node-overlay absolute inset-0 rounded-full" />
    </div>
  );
}

export function NodeShadow() {
  return <div className="h-18 w-18 rounded-full"></div>;
}
