import { useState } from 'react';
import '../../styles/withPagination.css';

import NavButton from '../NavButton';

export default function withPagination(ComponentBase) {
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
        page={page}
        updatePage={updatePage}
        pagination={pagination}
        {...props}
      />
    );
  };
}
