export default function ButtonGroup({ options, value, onChange }) {
  return (
    <div className="ui-chip-row">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={"ui-chip" + (value === opt.key ? " active" : "")}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
