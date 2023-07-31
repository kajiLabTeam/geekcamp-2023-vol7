type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
type Hour = `${number}${number}`;
type Minute = `${number}${number}`;
type Second = `${number}${number}`;
type Millisecond = `${number}${number}${number}`;
export type datetime =
  `${Year}-${Month}-${Day}T${Hour}:${Minute}:${Second}.${Millisecond}Z`;

export interface Technology {
  id: number;
  name: string;
  content: string;
  lastUpdated: datetime;
}

export interface Node {
  name: string;
  id: number;
  parentIds: number[];
  childIds: number[];
  articleId: number;
}
