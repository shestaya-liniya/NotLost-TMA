export default function Switch(prop: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={prop.checked}
        onChange={(e) => prop.onChange(e.target.checked)}
      />
      <div className="relative w-11 h-6 bg-primary peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-link"></div>
      <span className="ms-3 text-sm font-medium text-white/80">
        {prop.label}
      </span>
    </label>
  );
}
