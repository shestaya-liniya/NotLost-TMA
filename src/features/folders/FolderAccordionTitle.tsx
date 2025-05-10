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
        className="font-semibold outline-none text-ellipsis whitespace-nowrap max-h-3"
        contentEditable={props.isFocused}
        onInput={(e) => {
          const raw = e.currentTarget.innerText;
          const clean = sanitize(raw);
          setInput(clean);

          if (raw !== clean && ref.current) {
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            const offset = range?.startOffset || 0;

            ref.current.innerText = clean;

            if (selection && range && ref.current) {
              const newRange = document.createRange();
              newRange.setStart(
                ref.current.firstChild || ref.current,
                Math.min(offset, clean.length)
              );
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        }}
        onBlur={() => {
          if (props.isFocused) {
            const raw = ref.current?.innerText || "";
            const clean = sanitize(raw);
            props.onBlur(clean);

            if (ref.current && ref.current.innerText !== clean) {
              ref.current.innerText = clean;
            }
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
