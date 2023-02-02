export default function CourseStatusNotice({ status }) {
  if (status === 'pending')
    return (
      <div>
        This course is pending. Add course content, then open the course when
        ready.
      </div>
    );

  if (status === 'closed')
    return (
      <div>
        This course is closed. To allow students to enroll, open the course.
      </div>
    );

  return null;
}
