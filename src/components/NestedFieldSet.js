import { useState } from 'react';
import { capitalize } from '../utilities';
import uniqid from 'uniqid';

import withOrderAndDestroy from './higher-order/withOrderAndDestroy';
import Field from './Field';
import DestroyFields from './DestroyFields';

function NestedFieldSetBase({
  parentResource,
  nested: {
    resource,
    resourceText,
    resourceTitleAttribute,
    heading,
    multiple,
    initialInstanceCount,
    fields,
  },
  defaultValue,
  reOrder,
  destroy,
  instancesToDestroy,
  errors,
  toValidate,
  completed,
}) {
  const defaultInstances = multiple ? defaultValue : [defaultValue];
  const minimumInstances = initialInstanceCount ?? 1;
  const [instances, setInstances] = useState(
    defaultInstances?.[0]
      ? defaultInstances
      : [...new Array(minimumInstances)].map(() => ({
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
      {heading && <h2>{heading}</h2>}
      {instances.map((instance, i) => (
        <div key={instance.id || instance.tempId}>
          <h3>
            {(resourceTitleAttribute && instance[resourceTitleAttribute]) ||
              `${resourceText || capitalize(resource)} ${i + 1}`}
          </h3>
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
          {instances.length > minimumInstances && (
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
        <DestroyFields
          key={instanceToDestroy.id}
          parentResource={parentResource}
          resource={resource}
          instance={instanceToDestroy}
          formIndex={i + instances.length}
        />
      ))}
      {multiple && (
        <button onClick={add}>
          Add {resourceText || capitalize(resource)}
        </button>
      )}
    </div>
  );
}

const NestedFieldSet = withOrderAndDestroy(NestedFieldSetBase);
export default NestedFieldSet;
