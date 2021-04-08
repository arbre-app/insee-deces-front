import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ReactComponent as SvgMapFrance } from '../assets/map_france.svg';
import { scale } from 'chroma-js';

export function GeographyVisualization({ data }) {
  const ref = useRef();

  const counts = Object.fromEntries(data.map(({ name, count }) => [`departement${name.slice(1)}`, count]));

  const max = Math.max(...data.map(({ count }) => count));
  const scheme = scale('YlOrRd');

  useEffect(() => {
    const div = ref.current;
    if(div) {
      div.querySelectorAll('.departement').forEach(path => {
        const count = counts[[...path.classList].find(clazz => counts[clazz] !== undefined)] || 0;
        path.setAttribute('fill', count ? scheme(count / max).hex() : 'white');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-weight', '1');
      });
    }
  }, [ref, data]);

  return (
    <Row>
      <Col sm={{ offset: 1, span: 10 }} md={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }}>
        <div ref={ref} className="container-geography">
          <SvgMapFrance />
        </div>
      </Col>
    </Row>
  );
}

GeographyVisualization.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
};
