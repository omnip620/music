export interface ISong {
  id: string | number;
  url: string;
  coverSmall: string;
  name: string;
  source: string;
  like: boolean;
  authors?: string;
  localUrl?: string;
}
