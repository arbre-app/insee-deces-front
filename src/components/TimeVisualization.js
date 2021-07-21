import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Col, Overlay, Row, Tooltip } from 'react-bootstrap';
import { FormattedNumber, useIntl } from 'react-intl';
import { scale } from 'chroma-js';
import { createSVGElement } from '../utils';

const NS = 'http://www.w3.org/2000/svg';

export function TimeVisualization({ isLoading, data, isBirth }) {
  const intl = useIntl();
  const styleLoading = { opacity: '50%' };

  const [hoveredElementAndData, setHoveredElementAndData] = useState(null);
  const ref = useRef();

  const scheme = scale('YlOrRd');

  const maxRange = new Date().getFullYear() - 1850; // Maximum (theoretically) possible range

  const [width, height] = [500, 150];
  const [widthTicks, heightTicks] = [width / 20, height / 6];
  const widthBar = (width - widthTicks) / maxRange;
  const maxHeightBar = height - heightTicks;

  let eventsRegistered = null;
  useEffect(() => {
    const div = ref.current;
    if(div) {
      const [svg] = div.getElementsByTagName('svg');

      if(data) {
        svg.innerHTML = '';
      }

      if(data && data.length > 0) {
        const events = [];

        const values = Object.fromEntries(data.map(({ name, count }) => {
          const year = parseInt(name);
          return [year, { year, count }];
        }));
        const years = Object.values(values).map(({ year }) => year);
        const [minYear, maxYear] = [Math.min(...years), Math.max(...years)];

        const totalYears = maxYear - minYear + 1;
        const maxCount = Math.max(...Object.values(values).map(({ count }) => count));
        const dx = width * 5e-4;
        const colorForCount = count => scheme(count / maxCount).hex();

        const gTicks = createSVGElement('g');
        svg.append(gTicks);
        const gBars = createSVGElement('g');
        svg.append(gBars);
        const gFront = createSVGElement('g');
        svg.append(gFront);

        const offsetX = (width - (widthTicks + widthBar * totalYears)) / 2;

        for(let year = minYear; year <= maxYear; year++) {
          const i = year - minYear;
          if(values[year] !== undefined) {
            const currentData = values[year];
            const { count } = currentData;
            const h = maxHeightBar * count / maxCount;
            const rect = createSVGElement('rect', {
              x: offsetX + widthTicks + widthBar * i - dx,
              y: maxHeightBar - h,
              width: widthBar + 2 * dx,
              height: h,
              fill: colorForCount(count),
            });
            gBars.append(rect);

            if(eventsRegistered === null) {
              const handleEnter = () => setHoveredElementAndData([rect, currentData]);
              const handleLeave = () => setHoveredElementAndData(null);
              const localEvents = [
                [rect, 'mouseenter', handleEnter],
                [rect, 'mouseleave', handleLeave],
              ];
              events.push(...localEvents);
            }
          }
        }

        const maxX = offsetX + widthTicks + totalYears * widthBar;
        gFront.append(createSVGElement('line', {
          x1: offsetX + widthTicks,
          y1: maxHeightBar,
          x2: maxX,
          y2: maxHeightBar,
          stroke: 'black',
          'stroke-width': 1,
        }));

        const maxTicks = 5;
        const ticks = Math.min(maxTicks, maxCount + 1);
        const maxCountTick = Math.floor(maxCount / (ticks - 1)) * (ticks - 1);
        for(let i = 0; i < ticks; i++) {
          const currentCount = Math.round(maxCountTick * i / (ticks - 1));
          const y = maxHeightBar * (1 - currentCount / maxCount);
          if(i > 0) {
            gTicks.append(createSVGElement('line', {
              x1: offsetX + widthTicks,
              y1: y,
              x2: maxX,
              y2: y,
              stroke: '#d7d7d7',
              'stroke-width': 1,
            }));

            const ticksMargin = 5;
            const text = createSVGElement('text', {
              x: offsetX + widthTicks - ticksMargin,
              y: y,
              'text-anchor': 'end',
              'dominant-baseline': 'middle',
              'font-family': 'monospace',
              'font-size': 10,
            });
            text.append(intl.formatNumber(currentCount));
            gTicks.append(text);
          }

        }

        const yearsTicks = [];
        yearsTicks.push(minYear);
        if(totalYears >= 8) {
          yearsTicks.push(maxYear);
        }
        yearsTicks.forEach(year => {
          const textX = offsetX + widthTicks + (year - minYear) * widthBar;
          const textY = maxHeightBar + 5;
          const text = createSVGElement('text', {
            x: textX,
            y: textY,
            'text-anchor': 'end',
            'dominant-baseline': 'central',
            'transform': `rotate(-45, ${textX}, ${textY})`,
            'font-family': 'monospace',
            'font-size': 10,
          });
          text.append(year);
          gTicks.append(text);
        });

        if(eventsRegistered !== null) {
          eventsRegistered.forEach(([element, type, handler]) => element.removeEventListener(type, handler));
        }
        events.forEach(([element, type, handler]) => element.addEventListener(type, handler));
        eventsRegistered = events;
      }
    }
  }, [ref, data]);

  useEffect(() => () => { // Cleanup
    if(eventsRegistered !== null) {
      eventsRegistered.forEach(([element, type, handler]) => element.removeEventListener(type, handler));
    }
  }, []);

  const showTooltip = !isLoading && hoveredElementAndData !== null && data !== null;

  return (
    <Row style={isLoading ? styleLoading : null} className="mt-4">
      <Col sm={{ offset: 1, span: 10 }} md={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }}>
        <div className="text-center">
          <h4>Statistiques annuelles</h4>
          <p>
            Pour la recherche courante
          </p>
        </div>
        <div ref={ref} className="container-time">
          <svg xmlns={NS} viewBox={`0 0 ${width} ${height}`} className="" />
          {showTooltip && (
            <Overlay
              target={hoveredElementAndData[0]}
              show={showTooltip}
              placement="top"
              transition={false}
            >
              {(props) => {
                const { year, count } = hoveredElementAndData[1];
                return (
                  <Tooltip id="statistics-time-tooltip" {...props}>
                    Année {year}
                    <br />
                    <FormattedNumber value={count} /> {isBirth ? 'naissances' : 'décès'}
                  </Tooltip>
                );
              }}
            </Overlay>
          )}
        </div>
      </Col>
    </Row>
  );
}

TimeVisualization.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })),
  isBirth: PropTypes.bool.isRequired,
};

TimeVisualization.defaultProps = {
  isLoading: false,
};
