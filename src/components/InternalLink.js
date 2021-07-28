import PropTypes from 'prop-types';

export function InternalLink({ children, onClick, noScroll }) {
  const clickHandler = e => {
    e.preventDefault();
    e.target.blur();
    if(!noScroll) {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
    onClick();
  };
  return (
    <a href="#" onClick={clickHandler}>
      {children}
    </a>
  );
}

InternalLink.propTypes = {
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  noScroll: PropTypes.bool,
};

InternalLink.defaultProps = {
  noScroll: false,
};
