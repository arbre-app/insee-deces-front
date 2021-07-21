import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

export function BackButton({ onClick, ...props }) {
  const clickHandler = e => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
    });
    onClick();
  };

  return (
    <Pagination className="my-0" {...props}>
      <Pagination.First onClick={clickHandler}>
        <ArrowLeft className="icon mr-2" />
        Revenir au formulaire de recherche
      </Pagination.First>
    </Pagination>
  );
}

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
