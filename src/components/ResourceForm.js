import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResourceForm.css';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import MessageContext from './contexts/MessageContext';
import Field from './Field';
import NestedFieldSet from './NestedFieldSet';
import withFormValidation from './higher-order/withFormValidation';

function ResourceFormBase({
  heading = true,
  resource,
  fields,
  defaultValues = {},
  action,
  navPrefix = '',
  routePrefix = '',
  validate,
  toValidate,
  errors,
  handleErrors,
  id,
  close,
  completeAction,
  submitText,
  flash = true,
}) {
  const preAction = { create: 'new', update: 'edit' }[action];
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const setMessage = useContext(MessageContext).set;

  function completeFormAction(data) {
    setCompleted((completed) => (completed === 'true' ? true : 'true'));
    if (flash) setMessage(`Successfully ${action}d ${resource}.`);
    if (completeAction) completeAction(data);
    else
      navigate(`${navPrefix}/${resource}/${id || data.id}`, {
        state: { [`${resource}Data`]: data },
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) return;

    setLoading(true);
    const response = await fetcher(
      `${routePrefix}${resource}s${id ? `/${id}` : ''}`,
      {
        method: { create: 'POST', update: 'PATCH' }[action],
        body: new FormData(e.target),
      }
    );
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
          {typeof heading === 'string'
            ? heading
            : `${capitalize(preAction)} ${capitalize(resource)}`}
        </h1>
      )}
      {fields.map(
        ({
          attribute,
          type,
          value,
          defaultValue,
          valueOptions,
          onChange,
          labelText,
          attributeText,
          required,
          handleFieldErrors,
          nested,
        }) => {
          if (nested)
            return (
              <NestedFieldSet
                key={nested.resource}
                parentResource={resource}
                nested={nested}
                defaultValue={defaultValues[nested.resource]}
                errors={errors}
                toValidate={toValidate}
                completed={completed}
              />
            );
          else
            return (
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
                valueOptions={valueOptions}
                onChange={onChange}
                errors={errors}
                handleErrors={handleFieldErrors}
                toValidate={toValidate}
                required={required}
                completed={completed}
              />
            );
        }
      )}
      <button disabled={loading} type="submit">
        {submitText || `${capitalize(action)} ${capitalize(resource)}`}
      </button>
    </form>
  );
}

const ResourceForm = withFormValidation(ResourceFormBase);
export default ResourceForm;
