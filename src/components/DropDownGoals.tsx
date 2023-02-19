/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
import { Select } from 'flowbite-react';

export type GoalType =
  | 'Brand awareness'
  | 'Website traffic'
  | 'Sales and lead generation'
  | 'Engagement';

interface DropDownProps {
  goal: GoalType;
  setGoal: (goal: GoalType) => void;
}

const vibes: GoalType[] = [
  'Brand awareness',
  'Website traffic',
  'Sales and lead generation',
  'Engagement',
];

export default function DropDownGoals({ goal, setGoal }: DropDownProps) {
  return (
    <>
      <div id="select">
        <Select
          id="media"
          name="media"
          value={goal}
          onChange={(event) => setGoal(event.target.value as GoalType)}
        >
          {vibes.map((vibeItem) => (
            <option key={vibeItem}>{vibeItem}</option>
          ))}
        </Select>
      </div>
    </>
  );
}
