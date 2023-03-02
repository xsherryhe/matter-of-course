import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResourceForm.css';
import fetcher from '../fetcher';
import { capitalize } from '../utilities';

import MessageContext from './contexts/MessageContext';
import Field from './Field';
import NestedFieldSet from './NestedFieldSet';
import withFormValidation from './higher-order/withFormValidation';
import BackLink from './BackLink';

function ResourceFormBase({
  heading = true,
  resource,
  fields,
  defaultValues = {},
  action,
  navPrefix = '',
  routePrefix = '',
  route,
  validate,
  toValidate,
  formError,
  errors,
  handleErrors,
  id,
  back,
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

    if (flash)
      setMessage(
        typeof flash === 'function'
          ? flash(data)
          : `Successfully ${action}d ${resource}.`
      );
    else setMessage(null);

    if (completeAction) completeAction(data);
    else
      navigate(`${navPrefix}/${resource}/${id || data.id}`, {
        state: { [`${resource}Data`]: data },
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    setLoading(true);
    const response = await fetcher(
      route || `${routePrefix}${resource}s${id ? `/${id}` : ''}`,
      {
        method: { create: 'POST', update: 'PATCH' }[action],
        body: new FormData(e.target),
      }
    );
    if (response.status < 400) completeFormAction(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  return (
    <form className="resource" noValidate onSubmit={handleSubmit}>
      {close && (
        <button className="close" onClick={close}>
          X
        </button>
      )}
      <BackLink back={back} />
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
          Component,
        }) => {
          if (Component)
            return (
              <Component
                key={attribute}
                prefix={resource}
                errors={errors}
                toValidate={toValidate}
                required={required}
                attributeText={attributeText}
                labelText={labelText}
              />
            );
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
                value={value ? value(defaultValues, errors, completed) : null}
                defaultValue={
                  defaultValue
                    ? defaultValue(defaultValues, errors, completed)
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
      {!completed && formError && <div className="error">{formError}</div>}
    </form>
  );
}

const ResourceForm = withFormValidation(ResourceFormBase);
export default ResourceForm;
