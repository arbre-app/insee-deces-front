import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';

export function SmallPagination({ currentPage, totalPages }) {
  const renderPageItems = () => {
    const pages = [];
    if(totalPages <= 7) { // Display all page buttons
      for(let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if(currentPage <= 3) {
        for(let i = 1; i <= 5; i++) pages.push(i);
        pages.push(null);
        pages.push(totalPages);
      } else if(totalPages - currentPage <= 3) {
        pages.push(1);
        pages.push(null);
        for(let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(null);
        for(let i = -1; i <= 1; i++) pages.push(currentPage + i);
        pages.push(null);
        pages.push(totalPages);
      }
    }
    return pages.map(page => page !== null ? (
      <Pagination.Item key={page} active={page === currentPage}>
        {page}
      </Pagination.Item>
    ) : (
      <Pagination.Ellipsis key={-1} disabled={true} />
    ));
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev disabled={currentPage <= 1} />
      {renderPageItems()}
      <Pagination.Next disabled={currentPage >= totalPages} />
    </Pagination>
  );
}

SmallPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};
