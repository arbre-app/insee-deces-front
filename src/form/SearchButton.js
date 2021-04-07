import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useForm } from 'react-final-form';

export function SearchButton({ disabled }) {
  const form = useForm();
  const values = form.getState().values;
  const cannotSubmit = !values.surname || !values.surname.trim();

  return (
    <Button type="submit" disabled={cannotSubmit} className="width-max">
      <Search className="icon" />
      <span className="ml-2 d-inline d-md-none d-lg-inline">
        Rechercher
      </span>
    </Button>
  );
}

SearchButton.propTypes = {
  disabled: PropTypes.bool,
};

SearchButton.defaultProps = {
  disabled: false,
};
