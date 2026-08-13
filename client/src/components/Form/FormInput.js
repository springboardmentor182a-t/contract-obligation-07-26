export default function FormInput({ label, type = "text", value, defaultValue, onChange, placeholder, name, ...rest }) {
  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}
