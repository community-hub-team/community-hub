import { useState } from "react";

export default function PasswordToggle({ id, placeholder, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      <input
        type={show ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <i
        className={`fas ${show ? "fa-eye-slash" : "fa-eye"} toggle-password`}
        onClick={() => setShow(!show)}
      />
    </div>
  );
}
