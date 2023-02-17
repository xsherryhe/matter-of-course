import { useParams } from 'react-router-dom';

import ResourceForm from './ResourceForm';

export default function PostForm({
  action,
  postableType: propsPostableType,
  postableId: propsPostableId,
  ...props
}) {
  const { postableType: paramsPostableType, postableId: paramsPostableId } =
    useParams();
  const postableType = paramsPostableType || propsPostableType;
  const postableId = paramsPostableId || propsPostableId;

  const fields = [
    { attribute: 'title', required: true },
    {
      attribute: 'body',
      type: 'textarea',
      attributeText: 'Post',
      required: true,
    },
  ];
  return (
    <ResourceForm
      resource="post"
      fields={fields}
      action={action}
      navPrefix={`/${postableType}/${postableId}`}
      routePrefix={action === 'create' ? `${postableType}s/${postableId}/` : ''}
      {...props}
    />
  );
}
