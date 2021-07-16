import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export function SearchButton({ disabled }) {
  const renderButton = (
    <Button type="submit" disabled={disabled} className="width-max">
      <Search className="icon" />
      <span className="ml-2 d-inline d-md-none d-lg-inline">
          Rechercher
        </span>
    </Button>
  );
  const renderTooltip = (
    <Tooltip id="submit-warning">Vous devez entrer au moins un nom pour lancer une recherche</Tooltip>
  );
  return (
    <>
      {disabled && (
        <OverlayTrigger
          placement="top"
          delay={{ hide: 200 }}
          overlay={renderTooltip}
        >
          {/* Tooltips on disabled elements require a workaround */}
          <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: 2 }} />
        </OverlayTrigger>
      )}
      {renderButton}
    </>
  );
}

SearchButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
