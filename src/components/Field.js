import { useEffect, useRef, useState } from 'react';
import { humanName } from '../utilities';

export default function Field({
  prefix,
  attributes = [],
  errorAttributes: parentErrorAttributes,
  type = 'text',
  labelText,
  attributeText,
  value,
  valueOptions,
  defaultValue = '',
  onChange,
  errors = {},
  handleErrors,
  toValidate,
  required,
  completed = false,
  match,
  inputRef: propsInputRef,
}) {
  const attributeName =
    attributeText || humanName(attributes[attributes.length - 1]);
  const [fieldValue, setFieldValue] = useState(value || undefined);
  const [error, setError] = useState(null);
  const errorAttributes = parentErrorAttributes || [
    attributes.map((attribute) => attribute.split('_attributes')[0]).join('.'),
  ];
  const displayErrorFn =
    handleErrors ||
    ((errors) =>
      errorAttributes
        .reduce(
          (attributeErrors, attribute) => attributeErrors?.[attribute],
          errors
        )
        ?.map((error, i) => (
          <div key={i}>
            {attributeName} {error}
          </div>
        )));
  const displayError = error || displayErrorFn(errors);
  const fieldInputRef = useRef();
  const inputRef = propsInputRef || fieldInputRef;

  useEffect(() => {
    function validate() {
      if (!toValidate) return;

      inputRef.current?.setCustomValidity('');
      inputRef.current?.checkValidity();
      if (match && inputRef.current?.value !== match.ref.current?.value)
        inputRef.current.setCustomValidity(
          `${attributeName} must match ${match.name}.`
        );
      setError(inputRef.current?.validationMessage);
    }
    validate();
  }, [toValidate, inputRef, match, attributeName]);

  useEffect(() => {
    setFieldValue((fieldValue) => (value === false ? fieldValue : value));
  }, [value, errors, completed]);

  function handleChange(e) {
    if (onChange) onChange(e);
    setFieldValue(e.target.value);
  }

  const id = `${prefix || ''}_${attributes.join('_')}`;
  const name =
    (prefix || attributes[0]) +
    attributes
      .slice(prefix ? 0 : 1)
      .map((attribute) => `[${attribute}]`)
      .join('');
  const label = !(type === 'hidden') && (
    <label htmlFor={id}>{labelText ?? attributeName}</label>
  );
  const hasValue = value !== null && value !== undefined;
  let input = (
    <input
      value={hasValue ? fieldValue : undefined}
      defaultValue={hasValue ? undefined : defaultValue}
      onChange={hasValue ? handleChange : onChange}
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
        defaultValue={hasValue ? undefined : defaultValue}
        onChange={hasValue ? handleChange : onChange}
        name={name}
        id={id}
        required={required}
        ref={inputRef}
      />
    );
  if (type === 'select')
    input = (
      <select
        value={hasValue ? fieldValue : undefined}
        defaultValue={hasValue ? undefined : defaultValue}
        onChange={hasValue ? handleChange : onChange}
        name={name}
        id={id}
        required={required}
        ref={inputRef}
      >
        {valueOptions.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    );
  if (type === 'immutable') input = defaultValue;

  return (
    <div className="field">
      {type === 'checkbox' ? input : label}
      {type === 'checkbox' ? label : input}
      {!completed && displayError && (
        <div className="error">{displayError}</div>
      )}
    </div>
  );
}
