import { useContext, useState } from 'react';

import MessageContext from '../contexts/MessageContext';

export default function withFormValidation(FormBase) {
  return function Form(props) {
    const [formError, setFormError] = useState(null);
    const [errors, setErrors] = useState({});
    const [toValidate, setToValidate] = useState(false);

    const setMessage = useContext(MessageContext).set;

    function handleErrors({ data }) {
      setMessage(null);
      if (data.error) setFormError(data.error);
      else setErrors(data);
    }

    function validate(form) {
      setToValidate((validate) => (validate === 'true' ? true : 'true'));
      return form.checkValidity();
    }

    return (
      <FormBase
        validate={validate}
        toValidate={toValidate}
        formError={formError}
        errors={errors}
        handleErrors={handleErrors}
        {...props}
      />
    );
  };
}
