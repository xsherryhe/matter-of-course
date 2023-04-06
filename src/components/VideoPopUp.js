import '../styles/VideoPopUp.css';

import PopUp from './PopUp';
import Video from './Video';

export default function VideoPopUp({ video, type = 'mp4' }) {
  return (
    <PopUp>
      <Video video={video} type={type} autoPlay={true} />
    </PopUp>
  );
}
