import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Globe2 } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { AVAILABLE_LANGUAGES } from '../config';

// Partially borrowed from:
// https://github.com/arbre-app/browse-gedcom/blob/master/src/components/ChooseLanguage/ChooseLanguage.js

export function SelectLanguage({ currentLanguage, setLanguage, ...other }) {
  return (
    <DropdownButton
      title={(
        <Globe2 className="icon mr-1" />
      )}
      variant="outline-info"
      {...other}
    >
      <Dropdown.Header>
        <FormattedMessage id="common.language" />
      </Dropdown.Header>
      {AVAILABLE_LANGUAGES.map(({ locale, name, iconComponent: IconComponent }) => (
        <Dropdown.Item
          href="#"
          key={locale}
          onClick={() => setLanguage(locale)}
          active={locale === currentLanguage}
        >
          <IconComponent className="icon mr-2" />
          {name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
