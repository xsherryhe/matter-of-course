import { useState } from 'react';
import { capitalize } from '../utilities';
import uniqid from 'uniqid';

import Field from './Field';
import withOrderAndDestroy from './higher-order/withOrderAndDestroy';

function NestedFieldSetBase({
  parentResource,
  nested: { resource, resourceText, resourceTitleAttribute, multiple, fields },
  defaultValue,
  reOrder,
  destroy,
  instancesToDestroy,
  errors,
  toValidate,
  completed,
}) {
  const defaultInstances = multiple ? defaultValue : [defaultValue];
  const [instances, setInstances] = useState(
    defaultInstances?.[0]
      ? defaultInstances
      : [...new Array(1)].map(() => ({
          tempId: uniqid(),
          order: 1,
        }))
  );

  function add(e) {
    e.preventDefault();
    setInstances((instances) => [
      ...instances,
      { tempId: uniqid(), order: instances.length + 1 },
    ]);
  }

  function handleDestroy(instanceId) {
    return function (e) {
      e.preventDefault();
      setInstances((instances) => destroy(instanceId, instances));
    };
  }

  function handleReOrder(instanceId) {
    return function (e) {
      setInstances((instances) =>
        reOrder(instanceId, instances, Number(e.target.value))
      );
    };
  }

  return (
    <div>
      {instances.map((instance, i) => (
        <div key={instance.id || instance.tempId}>
          <h2>
            {(resourceTitleAttribute && instance[resourceTitleAttribute]) ||
              `${resourceText || capitalize(resource)} ${i + 1}`}
          </h2>
          {
            <Field
              prefix={parentResource}
              attributes={[
                `${resource}_attributes`,
                String(i),
                instance.id ? 'id' : 'temp_id',
              ]}
              type="hidden"
              defaultValue={instance.id || instance.tempId}
            />
          }
          {instances.length > 1 && (
            <button onClick={handleDestroy(instance.id || instance.tempId)}>
              Delete
            </button>
          )}
          {fields.map(
            ({
              attribute,
              type,
              value,
              defaultValue,
              valueOptions,
              order,
              labelText,
              attributeText,
              required,
              handleFieldErrors,
            }) => (
              <Field
                key={attribute}
                prefix={parentResource}
                attributes={[`${resource}_attributes`, String(i), attribute]}
                errorAttributes={[
                  `${resource}_errors`,
                  String(instance.id || instance.tempId),
                  attribute,
                ]}
                type={type}
                onChange={
                  order && handleReOrder(instance.id || instance.tempId)
                }
                labelText={labelText}
                attributeText={attributeText}
                value={
                  value ? value(instance, errors) : order && instance.order
                }
                defaultValue={
                  defaultValue
                    ? defaultValue(instance, errors)
                    : instance[attribute]
                }
                valueOptions={
                  valueOptions ||
                  (order &&
                    [...new Array(instances.length)].map((_, i) => ({
                      name: i + 1,
                      value: i + 1,
                    })))
                }
                errors={errors}
                handleErrors={handleFieldErrors}
                toValidate={toValidate}
                required={required}
                completed={completed}
              />
            )
          )}
        </div>
      ))}
      {instancesToDestroy.map((instanceToDestroy, i) => (
        <div key={instanceToDestroy.id}>
          <Field
            prefix={parentResource}
            attributes={[
              `${resource}_attributes`,
              String(i + instances.length),
              'id',
            ]}
            type="hidden"
            defaultValue={instanceToDestroy.id}
          />
          <Field
            prefix={parentResource}
            attributes={[
              `${resource}_attributes`,
              String(i + instances.length),
              '_destroy',
            ]}
            errorAttributes={[
              `${resource}_errors`,
              String(instanceToDestroy.id),
              '_destroy',
            ]}
            type="hidden"
            defaultValue={true}
          />
        </div>
      ))}
      <button onClick={add}>Add {resourceText || capitalize(resource)}</button>
    </div>
  );
}

const NestedFieldSet = withOrderAndDestroy(NestedFieldSetBase, {
  withDestroyFields: false,
});
export default NestedFieldSet;
