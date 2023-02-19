/* eslint-disable import/no-extraneous-dependencies */
import { Select } from 'flowbite-react';

export type SizeType = 'Small' | 'Medium' | 'Large';

interface DropDownProps {
  size: SizeType;
  setSize: (size: SizeType) => void;
}

const vibes: SizeType[] = ['Small', 'Medium', 'Large'];

export default function DropDownTargetNarrative({
  size,
  setSize,
}: DropDownProps) {
  return (
    <>
      <div id="select">
        <Select
          id="media"
          name="media"
          value={size}
          onChange={(event) => setSize(event.target.value as SizeType)}
        >
          {vibes.map((vibeItem) => (
            <option key={vibeItem}>{vibeItem}</option>
          ))}
        </Select>
      </div>
    </>
  );
}
