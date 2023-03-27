import '../styles/CourseAvatarAndTitle.css';

export default function CourseAvatarAndTitle({ course }) {
  return (
    <span className="course-avatar-and-title">
      <img className="course-avatar" src={course.avatar_url} alt="" />
      <span className="course-title">{course.title}</span>
    </span>
  );
}
