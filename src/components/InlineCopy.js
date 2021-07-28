import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, FormControl, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';

export function InlineCopy({ id, text, center }) {
  const [isCopied, setCopied] = useState(false);
  const [isCopiedTooltip, setCopiedTooltip] = useState(false);
  const selectInput = () => {
    const input = document.getElementById(id);
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
  const ClipboardIcon = isCopied ? ClipboardCheck : Clipboard;
  return (
    <InputGroup>
      <FormControl id={id} value={text} readOnly onClick={inputClickHandler} className={center ? 'text-center' : ''} />
      <InputGroup.Append>
        <OverlayTrigger
          placement="top"
          show={isCopiedTooltip}
          transition={false}
          overlay={
            <Tooltip id={`${id}-copy`}>
              <FormattedMessage id="common.copied" />
            </Tooltip>
          }
        >
          <Button variant="outline-secondary" onClick={buttonClickHandler} onMouseLeave={buttonLeaveHandler}>
            <ClipboardIcon className="icon" />
          </Button>
        </OverlayTrigger>
      </InputGroup.Append>
    </InputGroup>
  );
}

InlineCopy.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  center: PropTypes.bool,
};

InlineCopy.defaultProps = {
  center: false,
};
