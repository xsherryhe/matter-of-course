import { useContext, useState } from 'react';

import MessageContext from '../contexts/MessageContext';

export default function withFormValidation(FormBase) {
  return function Form(props) {
    const [errors, setErrors] = useState({});
    const [toValidate, setToValidate] = useState(false);

    const setMessage = useContext(MessageContext).set;

    function handleErrors({ data }) {
      if (data.error) setMessage(<span className="error">{data.error}</span>);
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
        errors={errors}
        handleErrors={handleErrors}
        {...props}
      />
    );
  };
}
