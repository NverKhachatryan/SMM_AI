/* eslint-disable import/no-extraneous-dependencies */
import { Select } from 'flowbite-react';

export type MediaType =
  | 'Facebook'
  | 'Instagram'
  | 'Twitter'
  | 'LinkedIn'
  | 'YouTube'
  | 'TikTok'
  | 'Snapchat'
  | 'Pinterest'
  | 'Reddit'
  | 'Twitch'
  | 'Other';

interface DropDownProps {
  media: MediaType;
  setMedia: (media: MediaType) => void;
}

const vibes: MediaType[] = [
  'Facebook',
  'Instagram',
  'Twitter',
  'LinkedIn',
  'YouTube',
  'TikTok',
  'Snapchat',
  'Pinterest',
  'Reddit',
  'Twitch',
  'Other',
];

export default function DropDownMedia({ media, setMedia }: DropDownProps) {
  return (
    <>
      <div id="select">
        <Select
          id="media"
          name="media"
          value={media}
          onChange={(event) => setMedia(event.target.value as MediaType)}
        >
          {vibes.map((vibeItem) => (
            <option key={vibeItem}>{vibeItem}</option>
          ))}
        </Select>
      </div>
    </>
  );
}
