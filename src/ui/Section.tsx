export default function Section(props: {
  title: string;
  Icon: React.ReactElement;
}) {
  return (
    <div className="p-4 w-full">
      <div className="bg-primary rounded-xl px-6 py-4 flex gap-4">
        {props.Icon}
        <div className="font-medium text-link">{props.title}</div>
      </div>
    </div>
  );
}
