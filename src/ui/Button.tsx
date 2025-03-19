import Tappable from "./Tappable";

export default function Button(props: {
  title: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tappable
      className="rounded-full px-6 py-2 bg-link/20 text-link font-semibold text-center"
      onClick={props.onClick}
    >
      {props.title}
    </Tappable>
  );
}
