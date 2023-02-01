import { useEffect, useRef, useState } from 'react';
import { humanName } from '../utilities';

export default function Field({
  prefix = '',
  attribute,
  type = 'text',
  label,
  errors = {},
  toValidate,
  required,
  match,
  parentInputRef,
}) {
  const [error, setError] = useState(null);
  const displayError =
    error || errors[attribute]?.map((error, i) => <div key={i}>{error}</div>);
  const fieldInputRef = useRef();
  const inputRef = parentInputRef || fieldInputRef;

  useEffect(() => {
    function validate() {
      if (!toValidate) return;

      inputRef.current.checkValidity();
      if (match && inputRef.current.value !== match.ref.current.value)
        inputRef.current.setCustomValidity(
          `${humanName(attribute, { capitalizeAll: false })} must match ${
            match.name
          }.`
        );
      setError(inputRef.current.validationMessage);
    }
    validate();
  }, [toValidate, inputRef, match, attribute]);

  return (
    <div className="field">
      <label htmlFor={`${prefix}_${attribute}`}>
        {label || humanName(attribute)}
      </label>
      <input
        type={type}
        name={prefix ? `${prefix}[${attribute}]` : attribute}
        id={`${prefix}_${attribute}`}
        required={required}
        ref={inputRef}
      />
      {displayError && <div className="error">{displayError}</div>}
    </div>
  );
}
