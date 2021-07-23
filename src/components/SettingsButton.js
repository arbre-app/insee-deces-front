import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { CheckCircle, CheckSquare, Circle, GearFill, Square } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setMatchesHighlighting, setTheme } from '../state/settings/action';

export const THEME_LIGHT = 'theme-light';
export const THEME_DARK = 'theme-dark';

export function SettingsButton({ ...props }) {
  const [isShown, setIsShown] = useState(false);
  const settingsState = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const theme = settingsState.data.theme;
  const setThemeDispatch = theme => dispatch(setTheme(theme));
  const createThemeChangeHandler = theme => e => {
    setThemeDispatch(theme);
    e.stopPropagation(); // TODO is it needed?
    e.preventDefault();
  };
  const matchesHighlighting = settingsState.data.matchesHighlighting;
  const setMatchesHighlightingDispatch = isEnabled => dispatch(setMatchesHighlighting(isEnabled));
  const handleSetMatchesHighlighting = e => {
    setMatchesHighlightingDispatch(!matchesHighlighting);
  };
  const CheckboxIcon = ({ isEnabled = false }) => {
    const Icon = isEnabled ? CheckSquare : Square;
    return <Icon className="icon mr-2" />;
  };
  const RadioIcon = ({ isEnabled = false }) => {
    const Icon = isEnabled ? CheckCircle : Circle;
    return <Icon className="icon mr-2" />;
  };
  return (
    <DropdownButton variant="secondary" id="dropdown-advanced-configuration" title={<GearFill className="icon" />} as="span" show={isShown} onToggle={(isOpen, event, metadata) => setIsShown(isOpen ? true : metadata.source === 'select')} {...props}>
      <Dropdown.Header>Recherche</Dropdown.Header>
      <Dropdown.Item onClick={handleSetMatchesHighlighting}>
        <CheckboxIcon isEnabled={matchesHighlighting} />
        Surbrillance
      </Dropdown.Item>
      <Dropdown.Header>Thème</Dropdown.Header>
      <Dropdown.Item onClick={createThemeChangeHandler(THEME_LIGHT)}>
        <RadioIcon isEnabled={theme === THEME_LIGHT} />
        Thème clair
      </Dropdown.Item>
      <Dropdown.Item onClick={createThemeChangeHandler(THEME_DARK)}>
        <RadioIcon isEnabled={theme === THEME_DARK} />
        Thème sombre
      </Dropdown.Item>
    </DropdownButton>
  );
}
