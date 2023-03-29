import { useState } from 'react';
import '../styles/AvatarField.css';

import Field from './Field';

export default function AvatarField({
  defaultValues = {},
  prefix,
  attributes,
  errors,
  toValidate,
}) {
  const [previewSrc, setPreviewSrc] = useState(defaultValues.avatar_url);
  const [lastFile, setLastFile] = useState(null);

  function updatePreview(imageFile) {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => setPreviewSrc(e.target.result));
    fileReader.readAsDataURL(imageFile);
  }

  function updateFile(e) {
    const imageFile = e.target.files?.[0];
    if (!imageFile) {
      if (lastFile) e.target.files = lastFile;
      return;
    }

    setLastFile(e.target.files);
    updatePreview(imageFile);
  }

  return (
    <div className="avatar-field">
      <img className="preview" src={previewSrc} alt="" />
      <Field
        prefix={prefix}
        attributes={attributes}
        type="file"
        onChange={updateFile}
        accept="image/*"
        fileTypes={['jpg', 'jpeg', 'png', 'svg', 'gif']}
        errors={errors}
        toValidate={toValidate}
      />
    </div>
  );
}
