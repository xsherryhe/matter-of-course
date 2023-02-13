export function capitalize(word) {
  return word && word[0].toUpperCase() + word.slice(1);
}

export function humanName(string, { capitalizeAll = true } = {}) {
  return string
    .split(/[-_]|(?<=[a-z])(?=[A-Z])/g)
    .map((word, i) => (capitalizeAll || i === 0 ? capitalize(word) : word))
    .join(' ');
}

export function list(array) {
  return array
    .map(
      (listItem, i) =>
        (i === array.length - 1 && i > 0 ? 'and ' : '') + listItem
    )
    .join(array.length < 3 ? ' ' : ', ');
}

export function getUniqueBy(array, attribute) {
  return array.filter(
    ({ [attribute]: val }, i, a) =>
      i === a.findIndex((item) => item[attribute] === val)
  );
}
