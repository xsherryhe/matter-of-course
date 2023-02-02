import { useState } from 'react';

export default function withFormValidation(FormBase) {
  return function Form(props) {
    const [errors, setErrors] = useState({});
    const [toValidate, setToValidate] = useState(false);

    function validate(form) {
      setToValidate((validate) => (validate === 'true' ? true : 'true'));
      return form.checkValidity();
    }

    return (
      <FormBase
        validate={validate}
        toValidate={toValidate}
        errors={errors}
        setErrors={setErrors}
        {...props}
      />
    );
  };
}
