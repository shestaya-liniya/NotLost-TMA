import { useEffect, useRef, useState } from "react";

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
  const [input, setInput] = useState(props.value);

  function sanitize(text: string): string {
    return text.replace(/\u200B/g, "").trim();
  }

  return (
    <div>
      <span
        ref={ref}
        className="font-semibold outline-none"
        contentEditable={props.isFocused}
        onInput={(e) => {
          const raw = e.currentTarget.innerText;
          const clean = sanitize(raw);
          setInput(clean);
        }}
        onBlur={() => {
          if (props.isFocused) {
            const raw = ref.current?.innerText || "";
            const clean = sanitize(raw);
            props.onBlur(clean);
          }
        }}
      >
        {props.value}
      </span>
      {input.length === 0 && (
        <span className="text-hint relative top-0.5">Title...</span>
      )}
    </div>
  );
}
