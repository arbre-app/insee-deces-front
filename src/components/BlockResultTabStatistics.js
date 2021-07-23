import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { EVENT_TYPE_BIRTH } from '../api';
import { SettingsButton } from './SettingsButton';
import { GeographyVisualization } from './GeographyVisualization';
import { PermalinkButton } from './PermalinkButton';
import { TimeVisualization } from './TimeVisualization';

export function BlockResultTabStatistics() {
  const formState = useSelector(state => state.form);
  const { loading: isGeographyLoading, data: statsGeographyData } = formState.statsGeography;
  const { loading: isTimeLoading, data: statsTimeData } = formState.statsTime;

  const geographyQueryString = formState.form !== null && [formState.form.surname, formState.form.givenName].map(s => (s || '').trim()).filter(s => s).join(' ');

  return (
    <div className="block block-tab py-2 px-2">
      <Row>
        <Col className="pr-0">
          <PermalinkButton isTabStats />
        </Col>
        <Col className="text-right pl-0">
          <SettingsButton />
        </Col>
      </Row>
      <GeographyVisualization
        isLoading={isGeographyLoading}
        data={statsGeographyData !== null ? statsGeographyData.results : null}
        queryString={geographyQueryString}
      />
      <Row>
        <Col xs={{ offset: 1, span: 10 }} md={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }}>
          <hr />
        </Col>
      </Row>
      <TimeVisualization
        isLoading={isTimeLoading}
        data={statsTimeData !== null ? statsTimeData.results : null}
        isBirth={formState.form.sortBy === EVENT_TYPE_BIRTH}
      />
    </div>
  );
}
