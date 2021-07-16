import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, FormControl, InputGroup, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import { Clipboard, ClipboardCheck, Link45deg, PinFill } from 'react-bootstrap-icons';
import Overlay from 'react-bootstrap-typeahead/lib/components/Overlay';

export function PermalinkButton({ url, disabled, ...props }) {
  const [isCopied, setCopied] = useState(false);
  const [isCopiedTooltip, setCopiedTooltip] = useState(false);
  const selectInput = () => {
    const input = document.getElementById('input-permalink');
    input.select();
  };
  const buttonClickHandler = () => {
    selectInput();
    document.execCommand('copy');
    setCopied(true);
    setCopiedTooltip(true);
  };
  const buttonLeaveHandler = () => setCopiedTooltip(false);
  const inputClickHandler = () => selectInput();
  const popoverToggleHandler = isToggled => {
    if (!isToggled) {
      setCopied(false);
      setCopiedTooltip(false);
    }
  };
  const ClipboardIcon = isCopied ? ClipboardCheck : Clipboard;
  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      rootClose
      onToggle={popoverToggleHandler}
      overlay={
        <Popover id="popover-permalink">
          <Popover.Title as="h3">
            <Link45deg className="icon mr-1" />
            Permalien vers cette recherche
          </Popover.Title>
          <Popover.Content>
            <InputGroup>
              <FormControl id="input-permalink" value={url} readOnly onClick={inputClickHandler} />
              <InputGroup.Append>
                <OverlayTrigger
                  placement="top"
                  show={isCopiedTooltip}
                  overlay={
                    <Tooltip id="tooltip-permalink-copy">
                      Copié
                    </Tooltip>
                  }
                >
                  <Button variant="outline-secondary" onClick={buttonClickHandler} onMouseLeave={buttonLeaveHandler}>
                    <ClipboardIcon className="icon" />
                  </Button>
                </OverlayTrigger>
              </InputGroup.Append>
            </InputGroup>
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
