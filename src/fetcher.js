import server from './server';

const errorMessage = 'Sorry, something went wrong.';
const statusErrorMessages = {
  422: 'Please make sure cookies are enabled.',
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
  { headers = {}, ...options } = {}
) {
  let response;
  try {
    response = await duration(
      5000,
      fetch(`${server}/${path}.json`, {
        mode: 'cors',
        credentials: 'include',
        headers: { 'X-CSRF-Token': headerData.csrf, ...headers },
        ...options,
      })
    );
  } catch (err) {
    throw new Error(errorMessage);
  }

  if (response.status !== 200 && !response.body) {
    const statusErrorMessage = statusErrorMessages[response.status] || '';
    throw new Error([errorMessage, statusErrorMessage].join(' '));
  }

  headerData.csrf = response.headers.get('CSRF-TOKEN') || headerData.csrf;
  return response;
}
