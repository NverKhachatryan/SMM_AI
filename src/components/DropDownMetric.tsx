/* eslint-disable import/no-extraneous-dependencies */
import { Select } from 'flowbite-react';

export type MetricType = 'None' | 'ROAS' | 'CPA' | 'CTR' | 'CPC' | 'CPM';
interface DropDownProps {
  metric: MetricType;
  setMetric: (metric: MetricType) => void;
}

const vibes: MetricType[] = ['None', 'ROAS', 'CPA', 'CTR', 'CPC', 'CPM'];

export default function DropDownMetric({ metric, setMetric }: DropDownProps) {
  return (
    <>
      <div id="select">
        <Select
          id="media"
          name="media"
          value={metric}
          onChange={(event) => setMetric(event.target.value as MetricType)}
        >
          {vibes.map((vibeItem) => (
            <option key={vibeItem}>{vibeItem}</option>
          ))}
        </Select>
      </div>
    </>
  );
}
