import { Location } from '../../types/Location';
import { Node } from '../../types/MmlNode';

export function parse(source: string): Node[];

export class SyntaxError {
  public readonly message: any;
  public readonly found: string;
  public readonly location: Location;
  public readonly name: string;

  constructor(message: any, expected: any, found: string, location: Location);
}
