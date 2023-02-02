import { useContext, useState } from 'react';

import MessageContext from '../contexts/MessageContext';

export default function withFormValidation(
  FormBase,
  { authenticated = false } = {}
) {
  return function Form(props) {
    const [errors, setErrors] = useState({});
    const [toValidate, setToValidate] = useState(false);

    const setMessage = useContext(MessageContext).set;

    function handleErrors(data, status) {
      if (status === 401 && authenticated)
        setMessage(<span className="error">{data.error}</span>);
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
