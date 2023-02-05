import { useEffect, useRef, useState } from 'react';
import { humanName } from '../utilities';

export default function Field({
  prefix,
  attributes = [],
  type = 'text',
  labelText,
  attributeText,
  value,
  defaultValue = '',
  errors = {},
  handleErrors,
  toValidate,
  required,
  completed,
  match,
  parentInputRef,
}) {
  const attributeName =
    attributeText || humanName(attributes[attributes.length - 1]);
  const [fieldValue, setFieldValue] = useState(value);
  const [error, setError] = useState(null);
  const errorAttributes = attributes
    .map((attribute) => attribute.split('_attributes')[0])
    .join('.');
  const displayErrorFn =
    handleErrors ||
    ((errors) =>
      errors[errorAttributes]?.map((error, i) => (
        <div key={i}>
          {attributeName} {error}
        </div>
      )));
  const displayError = error || displayErrorFn(errors);
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

  useEffect(() => {
    setFieldValue(value);
  }, [value, errors, completed]);

  function handleChange(e) {
    setFieldValue(e.target.value);
  }

  const id = `${prefix || ''}_${attributes.join('_')}`;
  const name =
    (prefix || attributes[0]) +
    attributes
      .slice(prefix ? 0 : 1)
      .map((attribute) => `[${attribute}]`)
      .join('');
  const label = <label htmlFor={id}>{labelText || attributeName}</label>;
  const hasValue = value !== null && value !== undefined;
  let input = (
    <input
      value={hasValue ? fieldValue : undefined}
      onChange={hasValue ? handleChange : undefined}
      defaultValue={hasValue ? undefined : defaultValue}
      type={type}
      name={name}
      id={id}
      required={required}
      ref={inputRef}
    />
  );
  if (type === 'textarea')
    input = (
      <textarea
        value={hasValue ? fieldValue : undefined}
        onChange={hasValue ? handleChange : undefined}
        defaultValue={hasValue ? undefined : defaultValue}
        name={name}
        id={id}
        required={required}
        ref={inputRef}
      />
    );

  return (
    <div className="field">
      {type === 'checkbox' ? input : label}
      {type === 'checkbox' ? label : input}
      {displayError && <div className="error">{displayError}</div>}
    </div>
  );
}
