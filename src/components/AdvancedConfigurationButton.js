import { Button, Dropdown, DropdownButton} from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../state/theme/action';

export const THEME_LIGHT = 'theme-light';
export const THEME_DARK = 'theme-dark';

export function AdvancedConfigurationButton({ ...props }) {
  const themeState = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const setThemeDispatch = theme => dispatch(setTheme(theme));
  const theme = themeState.data.theme;
  return (
    <DropdownButton variant="secondary" id="dropdown-advanced-configuration" title={<GearFill className="icon" />} as="span" {...props}>
      <Dropdown.Header>Thème</Dropdown.Header>
      <Dropdown.Item active={theme === THEME_LIGHT} onClick={e => {
        setThemeDispatch(THEME_LIGHT);
        e.stopPropagation();
        e.preventDefault();
      }}>
        Thème clair
      </Dropdown.Item>
      <Dropdown.Item active={theme === THEME_DARK} onClick={e => {
        setThemeDispatch(THEME_DARK);
        e.stopPropagation();
        e.preventDefault();
      }}>
        Thème sombre
      </Dropdown.Item>
    </DropdownButton>
  );
}
