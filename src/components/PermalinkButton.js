import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { Link45deg, PinFill } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { generatePermalink } from '../permalink';
import { useFormContext } from '../state/form';
import { InlineCopy } from './InlineCopy';

export function PermalinkButton({ disabled, isTabStats, ...props }) {
  const { state: { form } } = useFormContext();
  const url = generatePermalink(form, isTabStats);
  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      rootClose
      overlay={
        <Popover id="popover-permalink">
          <Popover.Title as="h3">
            <Link45deg className="icon mr-1" />
            <FormattedMessage id="result.permalink" />
          </Popover.Title>
          <Popover.Content>
            <InlineCopy id="input-permalink" text={url} />
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
  disabled: PropTypes.bool,
  isTabStats: PropTypes.bool,
};

PermalinkButton.defaultProps = {
  disabled: false,
  isTabStats: false,
};
