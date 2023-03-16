export default function List({ items }) {
  return items.map((element, i) => {
    if (i === items.length - 1 && i > 0)
      return <span key={i}>and {element}</span>;
    if (items.length >= 3) return <span key={i}>{element}, </span>;
    if (items.length > 1) return <span key={i}>{element} </span>;
    return <span key={i}>{element}</span>;
  });
}
