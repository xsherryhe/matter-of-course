import { useContext, useState } from 'react';
import '../styles/VideosField.css';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import thumbnailLoading from './../images/loading.gif';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import uniqid from 'uniqid';

import PopUpContext from './contexts/PopUpContext';
import Field from './Field';
import VideoPopUp from './VideoPopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VideosField({ defaultValues = {}, ...props }) {
  const [previews, setPreviews] = useState(
    defaultValues.videos.map((video) => video.thumbnail_url)
  );
  const setPopUp = useContext(PopUpContext).set;

  function addToPreview(e) {
    [...e.target.files].forEach((videoFile) => {
      setPreviews((previews) => [...previews, { thumbnail: thumbnailLoading }]);
      const reader = new FileReader();
      Promise.all([
        generateVideoThumbnails(videoFile, 1),
        new Promise((resolve) => reader.addEventListener('load', resolve)),
      ]).then(([thumbnailFiles, _]) =>
        setPreviews((previews) => [
          ...previews.slice(0, -1),
          { video: reader.result, thumbnail: thumbnailFiles[0] },
        ])
      );
      reader.readAsDataURL(videoFile);
    });
  }

  function showVideo(video) {
    return function () {
      setPopUp(<VideoPopUp video={video} type="mp4" />);
    };
  }
  // TO DO: Overlay thumbnail with play button that plays video when clicked
  // TO DO: Send thumbnail as data to back end
  // TO DO: UI for removing videos
  // TO DO: Make sure UI matches num of videos attached, e.g. on file cancellation, and fix as needed

  return (
    <div className="videos-field">
      <div className="previews">
        {previews.map(({ video, thumbnail }) => (
          <div key={uniqid()} className="preview">
            <img
              className={thumbnail === thumbnailLoading ? 'loading' : ''}
              src={thumbnail}
              alt=""
            />
            {thumbnail !== thumbnailLoading && (
              <button className="play" onClick={showVideo(video)}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
            )}
          </div>
        ))}
      </div>
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
