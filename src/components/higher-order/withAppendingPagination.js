import { useCallback, useState } from 'react';
import { capitalize } from '../../utilities';

export default function withAppendingPagination(ComponentBase, resourceName) {
  return function Component(props) {
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    function appendNextPage() {
      if (lastPage) return;

      setPage((page) => page + 1);
    }

    const updatePage = useCallback((data) => setLastPage(data.last_page), []);

    const appendButton = <button onClick={appendNextPage}>View More...</button>;

    return (
      <ComponentBase
        {...{
          [`${resourceName}Page`]: page,
          [`update${capitalize(resourceName)}Page`]: updatePage,
          [`${resourceName}AppendButton`]: !lastPage && appendButton,
        }}
        {...props}
      />
    );
  };
}
