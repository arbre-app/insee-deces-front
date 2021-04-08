import { GeographyVisualization } from './GeographyVisualization';

export function BlockResultTabStatistics() {
  return (
    <div className="block block-tab">
      <GeographyVisualization data={[{name: 'D-68', count: 1}]} />
    </div>
  );
}
