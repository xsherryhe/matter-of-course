import NavLink from './NavLink';

export default function BackLink({ back }) {
  if (!back) return null;

  const { route, state, location } = back;
  return (
    <NavLink to={route} state={state}>
      Back to {location}
    </NavLink>
  );
}
