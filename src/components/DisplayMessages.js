import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ErrorUnavailable } from '../api';
import { ErrorBadRequest } from '../api/errors';
import { clearError, clearWarning, useFormContext } from '../state/form';
import { useGedcomContext } from '../state/gedcom';
import { hideNewsMessage, useSettingsContext } from '../state/settings';
import {
  BadRequestErrorMessage,
  NetworkErrorMessage,
  NewsMessage,
  ServiceUnavailableMessage,
  UserWarningMessage,
} from './messages';

export function DisplayMessages({ legacyUrl, isTabForm }) {
  const { state: { error: errorForm, warnings }, dispatch: dispatchForm } = useFormContext();
  const { state: { data: { messageNewsVisible } }, dispatch: dispatchSettings } = useSettingsContext();
  const { state: { error: errorGedcom }, dispatch: dispatchGedcom } = useGedcomContext();
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
      {isTabForm ? (
        <>
          {errorForm !== null && (
            errorForm instanceof ErrorUnavailable ? (
              <ServiceUnavailableMessage serverMessage={errorForm.message} onClose={clearErrorDispatch} />
            ) : errorForm instanceof ErrorBadRequest ? (
              <BadRequestErrorMessage onClose={clearErrorDispatch} />
            ) : (
              <NetworkErrorMessage onClose={clearErrorDispatch} />
            )
          )}
          {warnings !== null && warnings.length > 0 && (
            <UserWarningMessage warnings={warnings} onClose={clearWarningDispatch} />
          )}
        </>
      ) : (
        <>
          {/* TODO gedcom errors */}
        </>
      )}
    </>
  );
}

DisplayMessages.propTypes = {
  isTabForm: PropTypes.bool.isRequired,
  legacyUrl: PropTypes.string,
};

DisplayMessages.defaultProps = {
  legacyUrl: null,
};
