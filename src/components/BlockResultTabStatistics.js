import { Col, Row } from 'react-bootstrap';
import { EVENT_TYPE_BIRTH } from '../api';
import { extractPeriodFromData } from '../form';
import { useFormContext } from '../state/form';
import { SettingsButton } from './SettingsButton';
import { GeographyVisualization } from './GeographyVisualization';
import { PermalinkButton } from './PermalinkButton';
import { TimeVisualization } from './TimeVisualization';

export function BlockResultTabStatistics() {
  const { state: {
    form,
    statsGeography: { loading: isGeographyLoading, data: statsGeographyData },
    statsTime: { loading: isTimeLoading, data: statsTimeData },
  } } = useFormContext();

  const geographyQueryString = form !== null && [form.surname, form.givenName].map(s => (s || '').trim()).filter(s => s).join(' ');
  const [yearAfter, yearBefore] = extractPeriodFromData(form);

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
        isBirth={form.sortBy === EVENT_TYPE_BIRTH}
        yearAfter={yearAfter != null && yearAfter.length > 0 ? parseInt(yearAfter) : null}
        yearBefore={yearBefore != null && yearBefore.length > 0 ? parseInt(yearBefore) : null}
      />
    </div>
  );
}
