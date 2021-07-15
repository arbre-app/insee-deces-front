import PropTypes from 'prop-types';
import { Button, FormControl, OverlayTrigger, Popover } from 'react-bootstrap';
import { PinFill } from 'react-bootstrap-icons';

export function PermalinkButton({ url, disabled, ...props }) {
  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={
        <Popover id="popover-permalink">
          <Popover.Title as="h3">Permalien vers cette recherche</Popover.Title>
          <Popover.Content>
            <FormControl />
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="info" disabled={disabled} {...props}>
        <PinFill className="icon" />
      </Button>
    </OverlayTrigger>
  );
}

PermalinkButton.propTypes = {
  url: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
