import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, FormControl, InputGroup, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import { Clipboard, ClipboardCheck, Link45deg, PinFill } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { generatePermalink } from '../permalink';
import { InlineCopy } from './InlineCopy';

export function PermalinkButton({ disabled, isTabStats, ...props }) {
  const formState = useSelector(state => state.form);
  const url = generatePermalink(formState.form, isTabStats);
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
