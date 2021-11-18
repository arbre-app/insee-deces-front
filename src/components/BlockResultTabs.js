import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useFormContext } from '../state/form';
import { BlockResultTabList } from './BlockResultTabList';
import { BlockResultTabStatistics } from './BlockResultTabStatistics';

const TAB_RESULTS = 'results-tab';
const TAB_STATISTICS = 'statistics-tab';

export function BlockResultTabs({ isTabStats, setTabStats }) {
  const { state: { data } } = useFormContext();
  return !!data && (
    <Tabs activeKey={isTabStats ? TAB_STATISTICS : TAB_RESULTS} onSelect={k => setTabStats(k === TAB_STATISTICS)} id="search-results" className="tabs" transition={false}>
      <Tab eventKey={TAB_RESULTS} title={<FormattedMessage id="result.tab.results" />}>
        <BlockResultTabList />
      </Tab>
      <Tab eventKey={TAB_STATISTICS} title={<FormattedMessage id="result.tab.statistics" />}>
        <BlockResultTabStatistics />
      </Tab>
    </Tabs>
  );
}

BlockResultTabs.propTypes = {
  isTabStats: PropTypes.bool.isRequired,
  setTabStats: PropTypes.func.isRequired,
};
