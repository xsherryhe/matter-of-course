export default function AssignmentSubmissionForm({
  heading = true,
  defaultValues,
  action,
  id,
  close,
  completeAction,
}) {
  // Don't use resource form
  // Get assignment from location state, or submission.assignment for update, or the assignmentId param with a fetch for create
  // If the assignment no longer exists
  // submit buttons disabled={!Boolean(submission.assignment)}
  // validate on front end and don't allow update
  // validate on back end with error handling from Assignment.find
  // different complete action for different types of submissions / assignments / save vs submit
}
