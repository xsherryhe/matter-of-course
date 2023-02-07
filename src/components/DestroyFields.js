import Field from './Field';

export default function DestroyFields({
  parentResource,
  resource,
  instance,
  formIndex,
}) {
  return (
    <div>
      <Field
        prefix={parentResource}
        attributes={[
          `${resource}_attributes`,
          String(formIndex ?? instance.id),
          'id',
        ]}
        type="hidden"
        defaultValue={instance.id}
      />
      <Field
        prefix={parentResource}
        attributes={[
          `${resource}_attributes`,
          String(formIndex ?? instance.id),
          '_destroy',
        ]}
        errorAttributes={[
          `${resource}_errors`,
          String(instance.id),
          '_destroy',
        ]}
        type="hidden"
        defaultValue={true}
      />
    </div>
  );
}
