export function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export function humanName(string, { capitalizeAll = true } = {}) {
  return string
    .split(/[-_]|(?<=[a-z])(?=[A-Z])/g)
    .map((word, i) => (capitalizeAll || i === 0 ? capitalize(word) : word))
    .join(' ');
}
