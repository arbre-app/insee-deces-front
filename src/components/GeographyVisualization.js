import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Col, Overlay, Row, Tooltip } from 'react-bootstrap';
import { FormattedNumber, useIntl } from 'react-intl';
import { ReactComponent as SvgMapFrance } from '../assets/map_france.svg';
import { scale } from 'chroma-js';
import { createSVGElement, NS } from '../utils';

export function GeographyVisualization({ isLoading, data, queryString }) {
  const intl = useIntl();

  const styleLoading = { opacity: '50%' };

  const [hoveredElement, setHoveredElement] = useState(null);
  const ref = useRef();

  let counts = {}, max = 0;
  if(!isLoading && data !== null) {
    counts = Object.fromEntries(data.map(({ name, count }) => [`departement${name.slice(1)}`, count]));
    max = Math.max(...data.map(({ count }) => count));
  }

  const scheme = scale('YlOrRd');
  const colorForCount = count => count > 0 ? scheme(count / max).hex() : 'white';

  const [scaleWidth, scaleHeight] = [700, 100];

  let eventsRegistered = null;
  useEffect(() => {
    const div = ref.current;
    if(div) {
      const events = [];
      const handleEnter = e => setHoveredElement(e.target);
      const handleLeave = () => setHoveredElement(null);
      div.querySelectorAll('.departement').forEach(path => {
        const count = counts[[...path.classList].find(className => counts[className] !== undefined)] || 0;
        path.setAttribute('fill', colorForCount(count));
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-weight', '1');
        if(eventsRegistered === null) {
          const localEvents = [
            [path, 'mouseenter', handleEnter],
            [path, 'mouseleave', handleLeave],
          ];
          events.push(...localEvents);
        }
      });
      if(eventsRegistered === null) {
        events.forEach(([element, type, handler]) => element.addEventListener(type, handler));
        eventsRegistered = events;
      }

      // Scale
      const scale = div.getElementsByTagName('svg')[1];
      scale.innerHTML = ''; // Clear

      const maxSamples = 7;
      const samples = Math.min(max + 1, maxSamples);
      const dx = scaleWidth * 5e-4;
      const gRect = createSVGElement('g');
      scale.append(gRect);
      const gText = createSVGElement('g');
      scale.append(gText);
      for(let i = 0; i < samples; i++) {
        const modeledCount = Math.round(i / (samples - 1) * max);
        const x = (i + (maxSamples - samples) / 2) / maxSamples * scaleWidth;
        const w = scaleWidth / maxSamples;
        const s = 3;
        gRect.append(createSVGElement('rect', {
          x: x - dx,
          y: 0,
          width: w + 2 * dx,
          height: scaleHeight,
          fill: colorForCount(modeledCount),
          stroke: 'black',
          'stroke-width': s,
        }));

        if(samples % 2 === 0 ? i === 0 || i === samples - 1 : i % 2 === 0) {
          const fontSize = scaleWidth / 25;
          const text = createSVGElement('text', {
            x: x + w / 2,
            y: scaleHeight + s + fontSize,
            'text-anchor': 'middle',
            'font-family': 'monospace',
            'font-size': fontSize,
            'class': 'plot-tick',
          });
          text.append(intl.formatNumber(modeledCount));
          gText.append(text);
        }
      }
    }
  }, [ref, data, intl]);

  useEffect(() => () => { // Cleanup
      if(eventsRegistered !== null) {
        eventsRegistered.forEach(([element, type, handler]) => element.removeEventListener(type, handler));
      }
  }, []);

  const padNumberTwo = v => v.length >= 2 ? v : `0${v}`;

  const getAttribute = (element, attribute) => {
    return element.getAttribute(attribute)
      .replace(/\\x(\w{2})/g, (_, a) => String.fromCharCode(parseInt(a, 16)))
      .replace(/\\u(\w{4})/g, (_, a) => String.fromCharCode(parseInt(a, 16)));
  };

  const showTooltip = !isLoading && hoveredElement !== null && data !== null;

  return (
    <Row style={isLoading ? styleLoading : null}>
      <Col sm={{ offset: 1, span: 10 }} md={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }}>
        <div className="text-center">
          <h4>Répartition géographique</h4>
          <p>
            Pour les noms "<em>{queryString}</em>", toutes périodes confondues
          </p>
        </div>
        <div ref={ref} className="container-geography">
          <SvgMapFrance />
          {showTooltip && (
            <Overlay
              target={hoveredElement}
              show={showTooltip}
              placement="top"
            >
              {(props) => {
                const name = getAttribute(hoveredElement, 'data-nom');
                const number = padNumberTwo(getAttribute(hoveredElement, 'data-numerodepartement'));
                const count = counts[[...hoveredElement.classList].find(className => counts[className] !== undefined)] || 0;
                return (
                  <Tooltip id="statistics-geography-tooltip" {...props}>
                    {name} ({number})
                    <br />
                    <FormattedNumber value={count} /> événements
                  </Tooltip>
                );
              }}
            </Overlay>
          )}
          <Row>
            <Col xs={{ offset: 1, span: 10 }} sm={{ offset: 2, span: 8 }} md={{ offset: 3, span: 6 }}>
              <svg xmlns={NS} viewBox={`0 0 ${scaleWidth} ${scaleHeight}`} className="mt-2 mb-4" />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}

GeographyVisualization.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })),
  queryString: PropTypes.string.isRequired,
};

GeographyVisualization.defaultProps = {
  isLoading: false,
};
