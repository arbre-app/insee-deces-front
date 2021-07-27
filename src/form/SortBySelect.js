import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { FunnelFill } from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH } from '../api';

export function SortBySelect({ disabled }) {
  const intl = useIntl();
  return (
    <Field
      name="sortBy"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            <FormattedMessage id="form.event" />
          </Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <FunnelFill className="icon" />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as="select"
              custom
              disabled={disabled}
              {...input}
            >
              <option value={EVENT_TYPE_BIRTH}>{intl.formatMessage({ id: 'common.event.birth' })}</option>
              <option value={EVENT_TYPE_DEATH}>{intl.formatMessage({ id: 'common.event.death' })}</option>
            </Form.Control>
          </InputGroup>
        </>
      )}
    />
  );
}

SortBySelect.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
