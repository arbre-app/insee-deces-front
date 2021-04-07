import { Button } from 'react-bootstrap';
import { ArrowCounterclockwise} from 'react-bootstrap-icons';
import { useForm } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { clearForm } from '../state/actions';

export function ClearButton() {
  const form = useForm();
  const dispatch = useDispatch();
  const clearFormDispatch = () => dispatch(clearForm());
  const handleClick = () => {
    form.reset();
    clearFormDispatch();
  };

  return (
    <Button variant="light" disabled={form.loading} className="width-max" onClick={handleClick}>
      <ArrowCounterclockwise className="icon" />
      <span className="ml-2 d-inline d-md-none d-lg-inline">
        Réinitialiser
      </span>
    </Button>
  );
}
