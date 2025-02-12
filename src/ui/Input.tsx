import { ChangeEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const Input = (props: {
  label: string;
  value: string;
  onInput: (value: string) => void;
  before?: React.ReactNode;
  className?: string;
}) => {
  const [inputValue, setInputValue] = useState(props.value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
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
        className="appearance-none border-none w-full focus:outline-none focus:ring-transparent "
        type="text"
        placeholder={props.label}
        value={inputValue}
        onChange={(e) => handleInputChange(e)}
      />
    </div>
  );
};

export default Input;
