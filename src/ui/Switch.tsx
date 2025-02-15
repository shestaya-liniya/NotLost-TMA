export default function Switch(prop: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer placeholder:text-hint"
        checked={prop.checked}
        onChange={(e) => prop.onChange(e.target.checked)}
      />
      <div className="relative w-11 h-6 bg-primary peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-link/80 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-link/30 after:border-link/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-link"></div>
      <span
        className={`ms-3 text-sm font-medium ${prop.checked ? "text-link" : "text-hint"}`}
      >
        {prop.label}
      </span>
    </label>
  );
}
