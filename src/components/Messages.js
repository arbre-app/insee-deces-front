import PropTypes from 'prop-types';
import { clearWarning, useFormContext } from '../state/form';
import { hideNewsMessage, useSettingsContext } from '../state/settings';
import { NetworkErrorMessage, NewsMessage, UserWarningMessage } from './messages';

export function Messages({ legacyUrl }) {
  const { state: { error, warnings }, dispatch: dispatchForm } = useFormContext();
  const { state: { data: { messageNewsVisible } }, dispatch: dispatchSettings } = useSettingsContext();
  const hideNewsMessageDispatch = () => dispatchSettings(hideNewsMessage());
  const clearWarningDispatch = () => dispatchForm(clearWarning());
  return (
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

Messages.propTypes = {
  legacyUrl: PropTypes.string,
};

Messages.defaultProps = {
  legacyUrl: null,
};
