import '../styles/CourseRoster.css';

import CourseRosterEntry from './CourseRosterEntry';

export default function CourseRoster({
  course: { id },
  roster,
  rosterError,
  rosterPage,
  rosterPagination,
}) {
  if (rosterError) return <div className="error">{rosterError}</div>;

  let tbody = (
    <tr>
      <td className="full-row">Loading...</td>
    </tr>
  );
  if (roster) {
    if (roster.length)
      tbody = roster.map(({ student }) => (
        <CourseRosterEntry
          key={student.id}
          rosterPage={rosterPage}
          courseId={id}
          student={student}
        />
      ));
    else
      tbody = (
        <tr>
          <td className="full-row">No students yet!</td>
        </tr>
      );
  }

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
      {roster?.length && rosterPagination}
    </div>
  );
}
