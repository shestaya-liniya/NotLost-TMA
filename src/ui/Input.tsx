import { ChangeEvent, useRef } from "react";
import { twMerge } from "tailwind-merge";

const Input = ({
  label,
  value,
  onInput,
  before,
  className,
  type = "text",
  onBlur,
}: {
  label: string;
  value: string;
  onInput: (value: string) => void;
  before?: React.ReactNode;
  className?: string;
  type?: "text" | "password";
  onBlur?: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInput(value);
  };

  return (
    <div
      className={twMerge(
        "relative rounded-full px-4 py-2 w-full bg-primary flex items-center gap-2",
        className
      )}
    >
      <div onClick={() => inputRef.current?.focus()}>{before}</div>
      <input
        ref={inputRef}
        className="appearance-none border-none w-full focus:outline-none focus:ring-transparent placeholder:text-hint "
        type={type}
        placeholder={label}
        value={value}
        onChange={(e) => handleInputChange(e)}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Input;
