import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { ArrowCounterclockwise, CheckCircle, CheckSquare, Circle, GearFill, Square } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import {
  resetSettings,
  setColumnActCode,
  setColumnEventType,
  setMatchesHighlighting,
  setTheme, setWikipediaLinks,
  THEME_DARK,
  THEME_LIGHT,
  useSettingsContext,
} from '../state/settings';
import { defaultState } from '../state/settings/reducer';
import { deepEqual } from '../utils';

export function SettingsButton({ ...props }) {
  const [isShown, setIsShown] = useState(false);
  const { state, dispatch } = useSettingsContext();
  const { data: { theme, matchesHighlighting, wikipediaLinks, columnEventType, columnActCode } } = state;
  const setThemeDispatch = theme => dispatch(setTheme(theme));
  const createThemeChangeHandler = theme => () => setThemeDispatch(theme);
  const setMatchesHighlightingDispatch = isEnabled => dispatch(setMatchesHighlighting(isEnabled));
  const setWikipediaLinksDispatch = isEnabled => dispatch(setWikipediaLinks(isEnabled));
  const setColumnEventTypeDispatch = isEnabled => dispatch(setColumnEventType(isEnabled));
  const setColumnActCodeDispatch = isEnabled => dispatch(setColumnActCode(isEnabled));
  const resetSettingsDispatch = () => dispatch(resetSettings());

  const CheckboxIcon = ({ isEnabled = false }) => {
    const Icon = isEnabled ? CheckSquare : Square;
    return <Icon className="icon mr-2" />;
  };
  const RadioIcon = ({ isEnabled = false }) => {
    const Icon = isEnabled ? CheckCircle : Circle;
    return <Icon className="icon mr-2" />;
  };

  const isSettingsUntouched = deepEqual(state, defaultState);

  return (
    <DropdownButton variant="secondary" id="dropdown-advanced-configuration" title={<GearFill className="icon" />} as="span" show={isShown} onToggle={(isOpen, event, metadata) => setIsShown(isOpen ? true : metadata.source === 'select')} {...props}>
      <Dropdown.Header><FormattedMessage id="settings.search" /></Dropdown.Header>
      <Dropdown.Item onClick={() => setMatchesHighlightingDispatch(!matchesHighlighting)}>
        <CheckboxIcon isEnabled={matchesHighlighting} />
        <FormattedMessage id="settings.highlight" />
      </Dropdown.Item>
      <Dropdown.Item onClick={() => setWikipediaLinksDispatch(!wikipediaLinks)}>
        <CheckboxIcon isEnabled={wikipediaLinks} />
        <FormattedMessage id="settings.wikipedia_links" />
      </Dropdown.Item>
      <Dropdown.Header><FormattedMessage id="settings.columns" /></Dropdown.Header>
      <Dropdown.Item onClick={() => setColumnEventTypeDispatch(!columnEventType)}>
        <CheckboxIcon isEnabled={columnEventType} />
        <FormattedMessage id="settings.column_event_type" />
      </Dropdown.Item>
      <Dropdown.Item onClick={() => setColumnActCodeDispatch(!columnActCode)}>
        <CheckboxIcon isEnabled={columnActCode} />
        <FormattedMessage id="settings.column_act_code" />
      </Dropdown.Item>
      <Dropdown.Header><FormattedMessage id="settings.theme" /></Dropdown.Header>
      <Dropdown.Item onClick={createThemeChangeHandler(THEME_LIGHT)}>
        <RadioIcon isEnabled={theme === THEME_LIGHT} />
        <FormattedMessage id="settings.theme_light" />
      </Dropdown.Item>
      <Dropdown.Item onClick={createThemeChangeHandler(THEME_DARK)}>
        <RadioIcon isEnabled={theme === THEME_DARK} />
        <FormattedMessage id="settings.theme_dark" />
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => resetSettingsDispatch()} disabled={isSettingsUntouched}>
        <ArrowCounterclockwise className="icon mr-2" />
        <FormattedMessage id="settings.restore" />
      </Dropdown.Item>
    </DropdownButton>
  );
}
