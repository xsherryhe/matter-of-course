import '../styles/List.css';

export default function List({ items }) {
  if (items.length === 0) return;
  if (items.length === 1) return items[0];
  if (items.length === 2)
    return (
      <span className="list">
        {items[0]}
        <span className="list-and"> and </span>
        {items[1]}
      </span>
    );

  const spans = items.reduce((arr, element, i) => {
    const newElements = [element];
    if (i < items.length - 1)
      newElements.push(
        <span className="list-comma">
          , {i === items.length - 2 ? 'and ' : ''}
        </span>
      );
    return [...arr, ...newElements];
  }, []);

  return (
    <span className="list">
      {spans.map((span, i) => (
        <span key={i}>{span}</span>
      ))}
    </span>
  );
}
