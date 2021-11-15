import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ErrorUnavailable } from '../api';
import { clearError, clearWarning, useFormContext } from '../state/form';
import { hideNewsMessage, useSettingsContext } from '../state/settings';
import { NetworkErrorMessage, NewsMessage, ServiceUnavailableMessage, UserWarningMessage } from './messages';

export function DisplayMessages({ legacyUrl }) {
  const { state: { error, warnings }, dispatch: dispatchForm } = useFormContext();
  const { state: { data: { messageNewsVisible } }, dispatch: dispatchSettings } = useSettingsContext();
  const hideNewsMessageDispatch = () => dispatchSettings(hideNewsMessage());
  const clearWarningDispatch = () => dispatchForm(clearWarning());
  const clearErrorDispatch = () => dispatchForm(clearError());

  const [initialized, setInitialized] = useState(false); // In case of server-side rendering
  useEffect(() => setInitialized(true), []);

  return initialized && (
    <>
      {messageNewsVisible && (
        <NewsMessage onClose={hideNewsMessageDispatch} legacyUrl={legacyUrl} />
      )}
      {error !== null && (
        error instanceof ErrorUnavailable ? (
          <ServiceUnavailableMessage serverMessage={error.message} onClose={clearErrorDispatch} />
        ) : (
          <NetworkErrorMessage onClose={clearErrorDispatch} />
        )
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
