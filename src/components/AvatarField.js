import { useState } from 'react';
import '../styles/AvatarField.css';

import Field from './Field';

export default function AvatarField({ user, errors, toValidate }) {
  const [previewSrc, setPreviewSrc] = useState(user.avatar_url);

  function updatePreview(e) {
    const imageFile = e.target.files?.[0];
    if (!imageFile) return;

    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => setPreviewSrc(e.target.result));
    fileReader.readAsDataURL(imageFile);
  }

  return (
    <div className="avatar-field">
      <img className="preview" src={previewSrc} alt="" />
      <Field
        prefix="user"
        attributes={['profile_attributes', 'avatar']}
        type="file"
        onChange={updatePreview}
        accept="image/*"
        fileTypes={['jpg', 'jpeg', 'png', 'svg', 'gif']}
        errors={errors}
        toValidate={toValidate}
      />
    </div>
  );
}