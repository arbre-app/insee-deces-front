import { Tab, Table, Tabs } from 'react-bootstrap';
import { BlockResultTabList } from './BlockResultTabList';
import { BlockResultTabStatistics } from './BlockResultTabStatistics';

export function BlockResultTabs() {
  return (
    <Tabs defaultActiveKey="results-tab" id="search-results" className="tabs" transition={false}>
      <Tab eventKey="results-tab" title="Résultats">
        <BlockResultTabList />
      </Tab>
      <Tab eventKey="statistics-tab" title="Statistiques">
        <BlockResultTabStatistics />
      </Tab>
    </Tabs>
  );
}
