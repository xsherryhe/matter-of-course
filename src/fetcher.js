import server from './server';

const errorMessage = 'Sorry, something went wrong.';
const statusErrorMessages = {
  401: 'You are unauthorized to do that action.',
  422: 'Sorry, something went wrong. Please sign in again and make sure cookies are enabled.',
};
const headerData = { csrf: null };

function duration(milliseconds, promise) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('Timed out. Please try again.')),
      milliseconds
    )
  );

  return Promise.race([promise, timeout]);
}

export default async function fetcher(
  path = '',
  { headers = {}, query = '', ...options } = {}
) {
  let response;
  try {
    response = await duration(
      5000,
      fetch(`${server}/${path}.json${query ? `?${query}` : ''}`, {
        mode: 'cors',
        credentials: 'include',
        headers: { 'X-CSRF-Token': headerData.csrf, ...headers },
        ...options,
      })
    );
  } catch (err) {
    throw new Error(errorMessage);
  }

  if (
    response.status >= 400 &&
    !(
      response.headers.get('content-type').includes('application/json') &&
      [401, 422].includes(response.status)
    )
  ) {
    const statusErrorMessage = statusErrorMessages[response.status] || '';
    throw new Error(statusErrorMessage);
  }

  headerData.csrf = response.headers.get('CSRF-TOKEN') || headerData.csrf;
  return response;
}
