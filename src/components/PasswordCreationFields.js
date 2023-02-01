import { useRef } from 'react';
import Field from './Field';

export default function PasswordCreationFields({ prefix, errors, toValidate }) {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  return (
    <div>
      <Field
        prefix={prefix}
        attribute="password"
        type="password"
        errors={errors}
        toValidate={toValidate}
        required={true}
        parentInputRef={passwordRef}
      />
      <Field
        prefix={prefix}
        attribute="password_confirmation"
        type="password"
        errors={errors}
        toValidate={toValidate}
        parentInputRef={passwordConfirmRef}
        match={{ name: 'password', ref: passwordRef }}
      />
    </div>
  );
}
