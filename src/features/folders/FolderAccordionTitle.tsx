import { useEffect, useRef } from "react";

export default function FolderAccordionTitle(props: {
  onBlur: (val: string) => void;
  isFocused: boolean;
  value: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isFocused && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();

      if (sel) {
        range.selectNodeContents(ref.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [props.isFocused]);

  return (
    <span
      ref={ref}
      className="font-semibold outline-none"
      contentEditable={props.isFocused}
      onBlur={() => {
        if (props.isFocused) {
          props.onBlur(ref.current?.innerText || "");
        }
      }}
    >
      {props.value}
    </span>
  );
}
