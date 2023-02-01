import { useEffect, useRef, useState } from 'react';
import { humanName } from '../utilities';

export default function Field({
  prefix,
  attributes = [],
  type = 'text',
  label,
  errors = {},
  toValidate,
  required,
  match,
  parentInputRef,
}) {
  const attributeName = humanName(attributes[attributes.length - 1]);
  const [error, setError] = useState(null);
  const errorAttributes = attributes
    .map((attribute) => attribute.split('_attributes')[0])
    .join('.');
  const displayError =
    error ||
    errors[errorAttributes]?.map((error, i) => (
      <div key={i}>
        {attributeName} {error}
      </div>
    ));
  const fieldInputRef = useRef();
  const inputRef = parentInputRef || fieldInputRef;

  useEffect(() => {
    function validate() {
      if (!toValidate) return;

      inputRef.current.checkValidity();
      if (match && inputRef.current.value !== match.ref.current.value)
        inputRef.current.setCustomValidity(
          `${attributeName} must match ${match.name}.`
        );
      setError(inputRef.current.validationMessage);
    }
    validate();
  }, [toValidate, inputRef, match, attributeName]);

  return (
    <div className="field">
      <label htmlFor={`${prefix || ''}_${attributes.join('_')}`}>
        {label || attributeName}
      </label>
      <input
        type={type}
        name={
          (prefix || attributes[0]) +
          attributes
            .slice(prefix ? 0 : 1)
            .map((attribute) => `[${attribute}]`)
            .join('')
        }
        id={`${prefix || ''}_${attributes.join('_')}`}
        required={required}
        ref={inputRef}
      />
      {displayError && <div className="error">{displayError}</div>}
    </div>
  );
}
