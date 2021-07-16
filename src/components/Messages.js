import { useSelector } from 'react-redux';
import { NetworkErrorMessage, NewsMessage, UserWarningMessage } from './messages';

export function Messages() {
  const formState = useSelector(state => state.form);
  const error = formState.error;
  const warnings = formState.warnings;
  return (
    <>
      <NewsMessage />
      {error !== null && (
        <NetworkErrorMessage />
      )}
      {warnings !== null && warnings.length > 0 && (
        <UserWarningMessage warnings={warnings} />
      )}
    </>
  );
}
