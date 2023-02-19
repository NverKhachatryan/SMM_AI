/* eslint-disable import/no-extraneous-dependencies */
import { Select } from 'flowbite-react';

export type TargetType = 'Acquisition' | 'Retargeting' | 'Retention';

interface DropDownProps {
  target: TargetType;
  setTarget: (target: TargetType) => void;
}

const vibes: TargetType[] = ['Acquisition', 'Retargeting', 'Retention'];

export default function DropDownTarget({ target, setTarget }: DropDownProps) {
  return (
    <>
      <div id="select">
        <Select
          id="media"
          name="media"
          value={target}
          onChange={(event) => setTarget(event.target.value as TargetType)}
        >
          {vibes.map((vibeItem) => (
            <option key={vibeItem}>{vibeItem}</option>
          ))}
        </Select>
      </div>
    </>
  );
}
