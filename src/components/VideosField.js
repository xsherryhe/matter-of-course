import { useState } from 'react';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import thumbnailLoading from './../images/logo192.png';

import Field from './Field';

export default function VideosField({ defaultValues = {}, ...props }) {
  const [previews, setPreviews] = useState(
    defaultValues.videos.map((video) => video.thumbnail_url)
  );

  function addToPreview(e) {
    [...e.target.files].forEach(async (videoFile) => {
      setPreviews((previews) => [...previews, { thumbnail: thumbnailLoading }]);
      const thumbnailFiles = await generateVideoThumbnails(videoFile, 1);
      setPreviews((previews) => [
        ...previews.slice(0, -1),
        { video: videoFile, thumbnail: thumbnailFiles[0] },
      ]);
    });
  }
  // TO DO: Get loading GIF for thumbnailLoading
  // TO DO: Overlay thumbnail with play button that plays video when clicked
  // TO DO: Send thumbnail as data to back end
  // TO DO: UI for removing videos

  return (
    <div className="avatar-field">
      {previews.map(({ video, thumbnail }) => (
        <img key={thumbnail} className="preview" src={thumbnail} alt="" />
      ))}
      <Field
        labelText="Attach Video"
        type="file"
        multiple={true}
        onChange={addToPreview}
        accept="video/mp4"
        fileTypes={['mp4']}
        {...props}
      />
    </div>
  );
}
