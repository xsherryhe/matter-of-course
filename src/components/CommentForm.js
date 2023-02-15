import ResourceForm from './ResourceForm';

export default function CommentForm({
  action,
  commentableType,
  commentableId,
  ...props
}) {
  const fields = [
    {
      attribute: 'body',
      type: 'textarea',
      labelText: '',
      attributeText: 'Comment',
      required: true,
    },
  ];

  return (
    <ResourceForm
      heading={false}
      resource="comment"
      fields={fields}
      action={action}
      routePrefix={
        action === 'create' ? `${commentableType}/${commentableId}/` : ''
      }
      completeAction={() => {}}
      back={false}
      flash={false}
      submitText="Comment"
      {...props}
    />
  );
}
