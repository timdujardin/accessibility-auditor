import type { PieSectorShapeProps } from 'recharts';

import { Sector } from 'recharts';

/**
 * @param {PieSectorShapeProps} props - Recharts sector shape props with payload containing color.
 * @returns {JSX.Element} A Sector element filled with the data entry's color.
 */
const ColoredSector = (props: PieSectorShapeProps) => <Sector {...props} fill={props.payload?.color} />;

export default ColoredSector;
