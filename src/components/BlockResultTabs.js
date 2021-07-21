import PropTypes from 'prop-types';
import { Tab, Table, Tabs } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BlockResultTabList } from './BlockResultTabList';
import { BlockResultTabStatistics } from './BlockResultTabStatistics';

const TAB_RESULTS = 'results-tab';
const TAB_STATISTICS = 'statistics-tab';

export function BlockResultTabs({ isTabStats, setTabStats }) {
  const form = useSelector(state => state.form);
  return !!form.data && (
    <Tabs activeKey={isTabStats ? TAB_STATISTICS : TAB_RESULTS} onSelect={k => setTabStats(k === TAB_STATISTICS)} id="search-results" className="tabs" transition={false}>
      <Tab eventKey="results-tab" title="Résultats">
        <BlockResultTabList />
      </Tab>
      <Tab eventKey="statistics-tab" title="Statistiques">
        <BlockResultTabStatistics />
      </Tab>
    </Tabs>
  );
}

BlockResultTabs.propTypes = {
  isTabStats: PropTypes.bool.isRequired,
  setTabStats: PropTypes.func.isRequired,
};
