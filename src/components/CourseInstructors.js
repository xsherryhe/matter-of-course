import { list } from '../utilities';

export default function CourseInstructors({ instructors }) {
  return (
    <div>
      Instructors: {list(instructors.map((instructor) => instructor.name))}
    </div>
  );
}
