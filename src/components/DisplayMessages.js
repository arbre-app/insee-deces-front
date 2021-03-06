import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ErrorUnavailable } from '../api';
import { ErrorBadRequest } from '../api/errors';
import { clearError, clearWarning, useFormContext } from '../state/form';
import {
  BadRequestErrorMessage,
  NetworkErrorMessage,
  ServiceUnavailableMessage,
  UserWarningMessage,
} from './messages';

export function DisplayMessages({ legacyUrl }) {
  const { state: { error, warnings }, dispatch: dispatchForm } = useFormContext();
  const clearWarningDispatch = () => dispatchForm(clearWarning());
  const clearErrorDispatch = () => dispatchForm(clearError());

  const [initialized, setInitialized] = useState(false); // In case of server-side rendering
  useEffect(() => setInitialized(true), []);

  return initialized && (
    <>
      {error !== null && (
        error instanceof ErrorUnavailable ? (
          <ServiceUnavailableMessage serverMessage={error.message} onClose={clearErrorDispatch} />
        ) : error instanceof ErrorBadRequest ? (
          <BadRequestErrorMessage onClose={clearErrorDispatch} />
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
