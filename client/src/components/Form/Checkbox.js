import { CheckIcon } from "../Icons";

export default function Checkbox({ checked, onChange, variant = "switch", label = null }) {
  if (variant === "check") {
    return (
      <label className="ui-checkbox-row">
        <button type="button" className={"ui-check" + (checked ? " checked" : "")} onClick={onChange}>
          {checked && <CheckIcon size={11} color="#fff" />}
        </button>
        {label && <span>{label}</span>}
      </label>
    );
  }
  return (
    <label className="ui-checkbox-row">
      <button type="button" className={"ui-toggle" + (checked ? " on" : "")} onClick={onChange} />
      {label && <span>{label}</span>}
    </label>
  );
}
