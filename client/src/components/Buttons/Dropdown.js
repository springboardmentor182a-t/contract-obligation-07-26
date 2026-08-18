import { useState, useRef, useEffect } from "react";

export default function Dropdown({ trigger, items, width = 220 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="ui-dropdown-wrap" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className="ui-dropdown-menu" style={{ width }}>
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              className={"ui-dropdown-item" + (item.danger ? " danger" : "")}
              onClick={() => {
                setOpen(false);
                if (item.onClick) item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
