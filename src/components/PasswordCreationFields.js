import { useRef } from 'react';
import Field from './Field';

export default function PasswordCreationFields({ prefix, errors, toValidate }) {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  return (
    <div>
      <Field
        prefix={prefix}
        attributes={['password']}
        type="password"
        errors={errors}
        toValidate={toValidate}
        required={true}
        parentInputRef={passwordRef}
      />
      <Field
        prefix={prefix}
        attributes={['password_confirmation']}
        type="password"
        errors={errors}
        toValidate={toValidate}
        parentInputRef={passwordConfirmRef}
        match={{ name: 'Password', ref: passwordRef }}
      />
    </div>
  );
}
