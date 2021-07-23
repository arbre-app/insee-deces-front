import { useDispatch, useSelector } from 'react-redux';
import { hideNewsMessage } from '../state/settings/action';
import { NetworkErrorMessage, NewsMessage, UserWarningMessage } from './messages';

export function Messages() {
  const formState = useSelector(state => state.form);
  const error = formState.error;
  const warnings = formState.warnings;
  const settingsState = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const hideNewsMessageDispatch = () => dispatch(hideNewsMessage());
  return (
    <>
      {settingsState.data.messageNewsVisible && (
        <NewsMessage onClose={hideNewsMessageDispatch} />
      )}
      {error !== null && (
        <NetworkErrorMessage />
      )}
      {warnings !== null && warnings.length > 0 && (
        <UserWarningMessage warnings={warnings} />
      )}
    </>
  );
}
