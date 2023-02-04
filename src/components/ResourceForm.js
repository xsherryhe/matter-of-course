import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResourceForm.css';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import MessageContext from './contexts/MessageContext';
import Field from './Field';
import withFormValidation from './higher-order/withFormValidation';

function ResourceFormBase({
  heading = true,
  resource,
  fields,
  defaultValues = {},
  action,
  validate,
  toValidate,
  errors,
  handleErrors,
  id,
  close,
  completeAction,
}) {
  const preAction = { create: 'new', update: 'edit' }[action];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setMessage = useContext(MessageContext).set;

  function completeFormAction(data) {
    setMessage(`Successfully ${action}d ${resource}.`);
    if (completeAction) completeAction(data);
    else
      navigate(`/${resource}/${id || data.id}`, {
        state: { [`${resource}Data`]: data },
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    setLoading(true);
    const response = await fetcher(`${resource}s${id ? `/${id}` : ''}`, {
      method: { create: 'POST', update: 'PATCH' }[action],
      body: new FormData(e.target),
    });
    const data = await response.json();
    if (response.status < 400) completeFormAction(data);
    else handleErrors(data);
    setLoading(false);
  }

  return (
    <form className="resource" noValidate onSubmit={handleSubmit}>
      {close && (
        <button className="close" onClick={close}>
          X
        </button>
      )}
      {heading && (
        <h1>
          {capitalize(preAction)} {capitalize(resource)}
        </h1>
      )}
      {fields.map(
        ({
          attribute,
          type,
          value,
          defaultValue,
          labelText,
          attributeText,
          required,
          handleFieldErrors,
        }) => (
          <Field
            key={attribute}
            prefix={resource}
            attributes={[attribute]}
            type={type}
            labelText={labelText}
            attributeText={attributeText}
            value={value ? value(defaultValues, errors) : null}
            defaultValue={
              defaultValue
                ? defaultValue(defaultValues, errors)
                : defaultValues[attribute]
            }
            errors={errors}
            handleErrors={handleFieldErrors}
            toValidate={toValidate}
            required={required}
          />
        )
      )}
      <button disabled={loading} type="submit">
        {capitalize(action)} {capitalize(resource)}
      </button>
    </form>
  );
}

const ResourceForm = withFormValidation(ResourceFormBase);
export default ResourceForm;
