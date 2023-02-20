import { useState } from 'react';
import '../../styles/withPagination.css';
import { capitalize } from '../../utilities';

import NavButton from '../NavButton';

export default function withPagination(ComponentBase, resourceName) {
  return function Component(props) {
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    function decrementPage() {
      setPage((page) => Math.max(page - 1, 1));
    }

    function incrementPage() {
      if (lastPage) return;

      setPage((page) => page + 1);
    }

    function updatePage(data) {
      setLastPage(data.last_page);
    }

    const pagination = (
      <footer className="pagination">
        <NavButton disabled={page === 1} onClick={decrementPage}>
          Previous
        </NavButton>
        <span>Page {page}</span>
        <NavButton disabled={lastPage} onClick={incrementPage}>
          Next
        </NavButton>
      </footer>
    );

    return (
      <ComponentBase
        {...{
          [`${resourceName}Page`]: page,
          [`update${capitalize(resourceName)}Page`]: updatePage,
          [`${resourceName}Pagination`]: pagination,
        }}
        {...props}
      />
    );
  };
}
