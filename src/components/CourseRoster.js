import '../styles/CourseRoster.css';

import CourseRosterEntry from './CourseRosterEntry';

export default function CourseRoster({ course: { id }, roster, rosterError }) {
  if (rosterError) return <div className="error">{rosterError}</div>;
  if (!roster) return 'Loading...';

  let tbody = 'No students yet!';
  if (roster.length)
    tbody = roster.map(({ student }) => (
      <CourseRosterEntry key={student.id} courseId={id} student={student} />
    ));

  return (
    <div>
      <h2>Course Roster</h2>
      <table className="course-roster">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tbody}</tbody>
      </table>
    </div>
  );
}
