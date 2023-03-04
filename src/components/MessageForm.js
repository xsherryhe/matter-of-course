import { useLocation } from 'react-router-dom';
import ResourceForm from './ResourceForm';

export default function MessageForm({
  recipientOptions: propsRecipientOptions,
  ...props
}) {
  const state = useLocation().state;
  const {
    defaultValues,
    recipientOptions: stateRecipientOptions,
    back,
  } = state || {};

  const recipientOptions = propsRecipientOptions || stateRecipientOptions;

  let recipientField = {
    attribute: 'recipient_login',
    labelText: 'To (username or email)',
    attributeText: 'Recipient in "To" field',
    required: true,
  };
  if (recipientOptions)
    recipientField = {
      ...recipientField,
      type: 'select',
      defaultValue: () =>
        recipientOptions.find(({ isDefault }) => isDefault)?.value,
      valueOptions: recipientOptions,
    };

  const fields = [
    recipientField,
    { attribute: 'subject', required: true },
    {
      attribute: 'body',
      type: 'textarea',
      required: true,
    },
    {
      attribute: 'parent_id',
      type: 'hidden',
    },
  ];

  return (
    <ResourceForm
      resource="message"
      action="create"
      defaultValues={defaultValues}
      fields={fields}
      back={back}
      flash="Message has been sent."
      completeAction={() => {}}
      submitText="Send Message"
      {...props}
    />
  );
}
