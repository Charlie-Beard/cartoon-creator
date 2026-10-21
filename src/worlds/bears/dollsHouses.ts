/**
 * SCAFFOLD: stand-ins, being drawn now.
 */
import { cached, rect, svg } from '../../art/paper';
import { wash } from '../../art/watercolour';

const dollsHouse = cached(() => svg({ w: 260, h: 300, name: 'bears-dolls-house' }, [wash(rect(0, 0, 260, 300), '#dddddd')]));
const dollsHouseWarped = cached(() => svg({ w: 300, h: 300, name: 'bears-dolls-house-warped' }, [wash(rect(0, 0, 300, 300), '#dddddd')]));
const birdHouse = cached(() => svg({ w: 280, h: 300, name: 'bears-bird-house' }, [wash(rect(0, 0, 280, 300), '#dddddd')]));

export const dollsHouses: Record<string, () => string> = {
  'dolls-house': dollsHouse,
  'dolls-house-warped': dollsHouseWarped,
  'bird-house': birdHouse,
};
