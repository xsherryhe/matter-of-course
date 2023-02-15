import { useContext } from 'react';

import UserContext from './contexts/UserContext';
import ResourceForm from './ResourceForm';

export default function CommentForm({
  action,
  commentableType,
  commentableId,
  ...props
}) {
  const { user } = useContext(UserContext);
  const fields = [
    {
      attribute: 'creator',
      type: 'immutable',
      labelText: '',
      defaultValue: () => user.name,
    },
    {
      attribute: 'body',
      type: 'textarea',
      labelText: '',
      attributeText: 'Comment',
      value: (defaultValues, _errors, completed) =>
        defaultValues?.body || (completed ? '' : false),
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
