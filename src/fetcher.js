import server from './server';

const errorMessage = 'Sorry, something went wrong.';
const statusErrorMessage = (status) =>
  ({
    401: 'Oops, unauthorized access! If this is an error, please try signing in again.',
    404: 'Page not found.',
    422: 'Sorry, something went wrong. Please sign in again and make sure cookies are enabled.',
  }[status] || 'Sorry, something went wrong.');
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
    return { data: { error: errorMessage } };
  }

  const status = response.status;
  let data;
  try {
    data = await response.json();
  } catch {
    return {
      status,
      data: status < 400 ? {} : { error: statusErrorMessage(status) },
    };
  }

  if (status >= 400 && ![401, 422].includes(status)) {
    return { status, data: { error: statusErrorMessage(status) } };
  }

  headerData.csrf = response.headers.get('CSRF-TOKEN') || headerData.csrf;
  return { status, data };
}
