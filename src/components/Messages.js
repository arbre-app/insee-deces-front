import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { clearWarning } from '../state/form/actions';
import { hideNewsMessage } from '../state/settings/action';
import { NetworkErrorMessage, NewsMessage, UserWarningMessage } from './messages';

export function Messages({ legacyUrl }) {
  const formState = useSelector(state => state.form);
  const error = formState.error;
  const warnings = formState.warnings;
  const settingsState = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const hideNewsMessageDispatch = () => dispatch(hideNewsMessage());
  const clearWarningDispatch = () => dispatch(clearWarning());
  return (
    <>
      {settingsState.data.messageNewsVisible && (
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
