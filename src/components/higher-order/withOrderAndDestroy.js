import { useState } from 'react';

import Field from '../Field';

export default function withOrderAndDestroy(
  Component,
  { withDestroyFields = true } = {}
) {
  return function OrderAndDestroyComponent({
    parentResource,
    resource: resourceProp,
    nested,
    ...props
  }) {
    const resource = resourceProp || nested?.resource;
    const [instancesToDestroy, setInstancesToDestroy] = useState([]);

    function defineOrder(instances) {
      if (!instances?.[0]?.order) return instances;

      return instances
        .sort((a, b) => a.order - b.order)
        .map((instance, i) => ({ ...instance, order: i + 1 }));
    }

    function destroy(instanceId, instances) {
      const instanceIndex = instances.findIndex(({ id, tempId }) =>
        [id, tempId].includes(instanceId)
      );
      if (instanceId === instances[instanceIndex].id)
        setInstancesToDestroy((instancesToDestroy) => [
          ...instancesToDestroy,
          instances[instanceIndex],
        ]);
      return defineOrder([
        ...instances.slice(0, instanceIndex),
        ...instances.slice(instanceIndex + 1),
      ]);
    }

    function reOrder(instanceId, instances, newOrder) {
      const instanceIndex = instances.findIndex(({ id, tempId }) =>
        [id, tempId].includes(instanceId)
      );
      const newInstance = {
        ...instances[instanceIndex],
        order: newOrder,
      };
      const newInstances = [
        ...instances.slice(0, instanceIndex),
        ...instances.slice(instanceIndex + 1),
      ];
      newOrder < instances[instanceIndex].order
        ? newInstances.unshift(newInstance)
        : newInstances.push(newInstance);
      return defineOrder(newInstances);
    }

    return (
      <div>
        <Component
          parentResource={parentResource}
          resource={resourceProp}
          nested={nested}
          reOrder={reOrder}
          destroy={destroy}
          instancesToDestroy={instancesToDestroy}
          {...props}
        />
        {withDestroyFields &&
          instancesToDestroy.map((instanceToDestroy, i) => (
            <div key={instanceToDestroy.id}>
              <Field
                prefix={parentResource}
                attributes={[
                  `${resource}_attributes`,
                  String(instanceToDestroy.id),
                  'id',
                ]}
                type="hidden"
                defaultValue={instanceToDestroy.id}
              />
              <Field
                prefix={parentResource}
                attributes={[
                  `${resource}_attributes`,
                  String(instanceToDestroy.id),
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
      </div>
    );
  };
}
