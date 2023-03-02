import { useState } from 'react';
import '../styles/CourseLessonsEdit.css';
import fetcher from '../fetcher';

import withFormValidation from './higher-order/withFormValidation';
import withOrderAndDestroy from './higher-order/withOrderAndDestroy';
import DestroyFields from './DestroyFields';
import Field from './Field';

function CourseLessonsEditBase({
  course: { id, lessons: initialLessons },
  reOrder,
  destroy,
  instancesToDestroy,
  formError,
  errors,
  handleErrors,
  validate,
  toValidate,
  hideEdit,
  finishEdit,
}) {
  const [lessons, setLessons] = useState(initialLessons);
  const [loading, setLoading] = useState(false);

  function handleDestroy(lessonId) {
    return function (e) {
      e.preventDefault();
      setLessons((lessons) => destroy(lessonId, lessons));
    };
  }

  function handleReOrder(lessonId) {
    return function (e) {
      setLessons((lessons) =>
        reOrder(lessonId, lessons, Number(e.target.value))
      );
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!(await validate(e.target))) return;

    setLoading(true);
    const response = await fetcher(`courses/${id}`, {
      method: 'PATCH',
      body: new FormData(e.target),
    });
    if (response.status < 400) finishEdit(response.data);
    else handleErrors(response);
    setLoading(false);
  }

  return (
    <div className="lesson-edit">
      <button className="close" onClick={hideEdit}>
        X
      </button>
      <form noValidate onSubmit={handleSubmit}>
        {lessons.map(({ id: lessonId, title, order }) => (
          <div key={lessonId}>
            <Field
              prefix="course"
              attributes={['lessons_attributes', String(lessonId), 'id']}
              type="hidden"
              defaultValue={lessonId}
            />
            <Field
              prefix="course"
              attributes={['lessons_attributes', String(lessonId), 'order']}
              errorAttributes={['lessons_errors', String(lessonId), 'order']}
              type="select"
              onChange={handleReOrder(lessonId)}
              labelText=""
              attributeText="Lesson #"
              value={order}
              valueOptions={[...new Array(lessons.length)].map((_, i) => ({
                name: i + 1,
                value: i + 1,
              }))}
              errors={errors}
              toValidate={toValidate}
              required={true}
            />
            {title}
            <button onClick={handleDestroy(lessonId)}>Delete</button>
          </div>
        ))}
        {instancesToDestroy.map((instanceToDestroy) => (
          <DestroyFields
            key={instanceToDestroy.id}
            parentResource="course"
            resource="lessons"
            instance={instanceToDestroy}
          />
        ))}
        <button disabled={loading} type="submit">
          Submit
        </button>
        {formError && <div className="error">{formError}</div>}
      </form>
    </div>
  );
}

const CourseLessonsEdit = withFormValidation(
  withOrderAndDestroy(CourseLessonsEditBase)
);
export default CourseLessonsEdit;
