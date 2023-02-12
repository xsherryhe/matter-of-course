import ResourceForm from './ResourceForm';

export default function MessageForm({ recipientOptions, ...props }) {
  let subjectField = { attribute: 'subject', required: true };
  if (recipientOptions)
    subjectField = {
      ...subjectField,
      type: 'select',
      valueOptions: recipientOptions,
    };

  const fields = [
    {
      attribute: 'recipient_login',
      labelText: 'To (username or email)',
      attributeText: 'Recipient in "To" field',
      required: true,
    },
    subjectField,
    {
      attribute: 'body',
      type: 'textarea',
      required: true,
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
