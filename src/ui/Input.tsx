import { ChangeEvent, useState } from "react";

const Input = (props: {
  label: string;
  value: string;
  onInput: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(props.value);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    props.onInput(value);
  };

  return (
    <input
      className="appearance-none border-none rounded-full px-6 py-2 w-full focus:outline-none focus:ring-transparent bg-primary"
      type="text"
      placeholder={props.label}
      value={inputValue}
      onChange={(e) => handleInputChange(e)}
    />
  );
};

export default Input;
