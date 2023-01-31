export default function CoursesItem({ course }) {
  return (
    <div>
      <div>{course.title}</div>
      <div>{course.description}</div>
    </div>
  );
}
