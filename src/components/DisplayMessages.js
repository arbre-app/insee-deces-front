import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { clearWarning, useFormContext } from '../state/form';
import { hideNewsMessage, useSettingsContext } from '../state/settings';
import { NetworkErrorMessage, NewsMessage, UserWarningMessage } from './messages';

export function DisplayMessages({ legacyUrl }) {
  const { state: { error, warnings }, dispatch: dispatchForm } = useFormContext();
  const { state: { data: { messageNewsVisible } }, dispatch: dispatchSettings } = useSettingsContext();
  const hideNewsMessageDispatch = () => dispatchSettings(hideNewsMessage());
  const clearWarningDispatch = () => dispatchForm(clearWarning());

  const [initialized, setInitialized] = useState(false); // In case of server-side rendering
  useEffect(() => setInitialized(true), []);

  return initialized && (
    <>
      {messageNewsVisible && (
        <NewsMessage onClose={hideNewsMessageDispatch} legacyUrl={legacyUrl} />
      )}
      {error !== null && (
        <NetworkErrorMessage />
      )}
      {warnings !== null && warnings.length > 0 && (
        <UserWarningMessage warnings={warnings} onClose={clearWarningDispatch} />
      )}
    </>
  );
}

DisplayMessages.propTypes = {
  legacyUrl: PropTypes.string,
};

DisplayMessages.defaultProps = {
  legacyUrl: null,
};
