export default function FormSelect({ label, options = [], value, defaultValue, onChange, name, ...rest }) {
  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      <select name={name} value={value} defaultValue={defaultValue} onChange={onChange} {...rest}>
        {options.map((opt, i) => {
          const isObj = typeof opt === "object" && opt !== null;
          const val = isObj ? opt.value : opt;
          const lbl = isObj ? opt.label : opt;
          return (
            <option key={i} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}
