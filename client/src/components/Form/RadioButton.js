export default function RadioButton({ name, value, checked, onChange, label }) {
  return (
    <label className={"ui-radio-row" + (checked ? " checked" : "")}>
      <span className="ui-radio-dot">{checked && <span className="ui-radio-dot-inner" />}</span>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ display: "none" }} />
      <span>{label}</span>
    </label>
  );
}
