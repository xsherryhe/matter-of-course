import { list } from '../utilities';

export default function CourseInstructors({ instructors }) {
  return <div>Instructors: {list(instructors.map(({ name }) => name))}</div>;
}
