import PropTypes from 'prop-types';
import { Form, Tab, Tabs } from 'react-bootstrap';
import { BlockForm } from './BlockForm';
import { BlockGedcomTab } from './BlockGedcomTab';

const TAB_FORM = 'search-form';
const TAB_GEDCOM = 'search-gedcom';

export function BlockSearchModeTabs({ isTabForm, setTabForm, setTabStats, permalinkData, setPermalinkData }) {
  return (
    <Tabs activeKey={isTabForm ? TAB_FORM : TAB_GEDCOM} onSelect={k => setTabForm(k === TAB_FORM)} className="tabs" transition={false}>
      <Tab eventKey={TAB_FORM} title="Recherche">
        <BlockForm initialPartialData={permalinkData !== null ? permalinkData[0] : null} setInitialPartialData={() => setPermalinkData(null)} onClear={() => setTabStats(false)} />
      </Tab>
      <Tab eventKey={TAB_GEDCOM} title="Gedcom">
        <BlockGedcomTab />
      </Tab>
    </Tabs>
  );
}

BlockSearchModeTabs.propTypes = {
  isTabForm: PropTypes.bool.isRequired,
  setTabForm: PropTypes.func.isRequired,
  setTabStats: PropTypes.func.isRequired,
  permalinkData: PropTypes.object,
  setPermalinkData: PropTypes.func.isRequired,
};

BlockSearchModeTabs.defaultProps = {
  permalinkData: null,
};
