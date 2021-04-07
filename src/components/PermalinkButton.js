import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { PinFill } from 'react-bootstrap-icons';

export function PermalinkButton({ url }) {
  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={
        <Popover id="popover-permalink">
          <Popover.Title as="h3">abc</Popover.Title>
          <Popover.Content>
            <strong>Holy guacamole!</strong> Check this info.
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="info">
        <PinFill className="icon" />
      </Button>
    </OverlayTrigger>
  );
}

PermalinkButton.propTypes = {
  url: PropTypes.string.isRequired,
};
