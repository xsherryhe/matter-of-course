export default function List({ items }) {
  return items.map((element, i) => {
    if (i === items.length - 1 && i > 0) return <span>and {element}</span>;
    if (items.length >= 3) return <span>{element}, </span>;
    if (items.length > 1) return <span>{element} </span>;
    return element;
  });
}
