import { useRef } from 'react';
import Field from './Field';

export default function PasswordCreationFields({
  prefix,
  errors,
  toValidate,
  required,
  labelText,
  confirmationLabelText,
}) {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  return (
    <div>
      <Field
        prefix={prefix}
        attributes={['password']}
        type="password"
        labelText={labelText}
        errors={errors}
        toValidate={toValidate}
        required={required ?? true}
        inputRef={passwordRef}
      />
      <Field
        prefix={prefix}
        attributes={['password_confirmation']}
        type="password"
        labelText={confirmationLabelText}
        errors={errors}
        toValidate={toValidate}
        inputRef={passwordConfirmRef}
        required={required ?? true}
        match={{ name: 'Password', ref: passwordRef }}
      />
    </div>
  );
}
