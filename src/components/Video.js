export default function Video({ video, type = 'mp4', autoPlay = false }) {
  return (
    <video controls autoPlay={autoPlay}>
      <source src={video} type={`video/${type}`} />
      Sorry, videos are not supported by your browser.
    </video>
  );
}
