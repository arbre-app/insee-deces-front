import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { FormattedNumber } from 'react-intl';

export function SmallPagination({ currentPage, totalPages, onChange, disabled, ...other }) {
  const renderPageItems = () => {
    const pages = [];
    if(totalPages <= 7) { // Display all page buttons
      for(let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if(currentPage <= 3) {
        for(let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if(totalPages - currentPage <= 3) {
        pages.push(1);
        pages.push(-1);
        for(let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for(let i = -1; i <= 1; i++) pages.push(currentPage + i);
        pages.push(-2);
        pages.push(totalPages);
      }
    }
    return pages.map(page => page > 0 ? (
      <Pagination.Item key={page} active={page === currentPage} onClick={() => page !== currentPage && onChange(page)} disabled={disabled}>
        <FormattedNumber value={page} />
      </Pagination.Item>
    ) : (
      <Pagination.Ellipsis key={page} disabled={true} />
    ));
  };

  const isFirst = currentPage <= 1, isLast = currentPage >= totalPages;

  return (
    <Pagination className="justify-content-center" {...other}>
      <Pagination.Prev disabled={isFirst || disabled} onClick={() => !isFirst && onChange(currentPage - 1)} />
      {renderPageItems()}
      <Pagination.Next disabled={isLast || disabled} onClick={() => !isLast && onChange(currentPage + 1)} />
    </Pagination>
  );
}

SmallPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
