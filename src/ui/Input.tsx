import { ChangeEvent, useRef } from "react";
import { twMerge } from "tailwind-merge";

const Input = (props: {
  label: string;
  value: string;
  onInput: (value: string) => void;
  before?: React.ReactNode;
  className?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    props.onInput(value);
  };

  return (
    <div
      className={twMerge(
        "relative rounded-full px-4 py-2 w-full bg-primary flex items-center gap-2",
        props.className
      )}
    >
      <div onClick={() => inputRef.current?.focus()}>{props.before}</div>
      <input
        ref={inputRef}
        className="appearance-none border-none w-full focus:outline-none focus:ring-transparent placeholder:text-hint "
        type="text"
        placeholder={props.label}
        value={props.value}
        onChange={(e) => handleInputChange(e)}
      />
    </div>
  );
};

export default Input;
