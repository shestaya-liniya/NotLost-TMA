export default function TelegramAvatar(props: {
  username: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const getSize = () => {
    switch (props.size) {
      case "sm":
        return 10;
      default:
        return 12;
    }
  };
  return (
    <img
      loading="lazy"
      src={`https://t.me/i/userpic/320/${props.username}.svg`}
      className={`h-${getSize()} w-${getSize()} rounded-full mt-2`}
      decoding="async"
      alt="Telegram avatar"
    />
  );
}
