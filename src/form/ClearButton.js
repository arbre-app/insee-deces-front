import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { ArrowCounterclockwise} from 'react-bootstrap-icons';
import { useForm } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { clearForm, useFormContext } from '../state/form';

export function ClearButton({ initialValues, disabled, onClick }) {
  const form = useForm();
  const { dispatch: dispatchForm } = useFormContext();
  const clearFormDispatch = () => dispatchForm(clearForm());
  const handleClick = () => {
    form.reset(initialValues);
    clearFormDispatch();
    onClick();
  };

  return (
    <Button variant="light" disabled={disabled} className="width-max" onClick={handleClick}>
      <ArrowCounterclockwise className="icon" />
      <span className="ml-2 d-inline d-md-none d-lg-inline">
        <FormattedMessage id="form.clear" />
      </span>
    </Button>
  );
}

ClearButton.propTypes = {
  initialValues: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
