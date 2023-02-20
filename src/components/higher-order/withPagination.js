import { useState } from 'react';

import NavButton from '../NavButton';

export default function withPagination(ComponentBase) {
  return function Component(props) {
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    function decrementPage() {
      setPage((page) => page - 1);
    }

    function incrementPage() {
      setPage((page) => page + 1);
    }

    const pagination = (
      <footer className="pagination">
        {page > 1 && <NavButton onClick={decrementPage}>Previous</NavButton>}
        <span>Page {page}</span>
        {!lastPage && <NavButton onClick={incrementPage}>Next</NavButton>}
      </footer>
    );

    return (
      <ComponentBase
        page={page}
        setLastPage={setLastPage}
        pagination={pagination}
        {...props}
      />
    );
  };
}
