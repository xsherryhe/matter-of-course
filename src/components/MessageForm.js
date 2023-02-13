import ResourceForm from './ResourceForm';

export default function MessageForm({ recipientOptions, ...props }) {
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
      fields={fields}
      flash="Message has been sent."
      completeAction={() => {}}
      submitText="Send Message"
      {...props}
    />
  );
}
