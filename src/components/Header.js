import { Book } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';

export function Header() {
  return (
    <div className="text-center pt-4">
      <Book className="icon h1" />
      <h1 className="h4"><FormattedMessage id="header.title" /></h1>
    </div>
  );
}
