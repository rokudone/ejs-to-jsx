import 'sparser';

type ejsToJsx = (ejs: string) => string;

declare global {
   var sparser: sparser;
}
