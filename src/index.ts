import { add } from "./example/something";

console.log('Try npm run lint/fix!');

const longString =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.';

const trailing = 'Semicolon';

const why = 'am I tabbed?';

export function doSomeStuff(
  withThis: string,
  andThat: string,
  andThose: string[]
) {
  //function on one line
  if (!andThose.length) {
    return false;
  }
  console.log(withThis);
  console.log(andThat);
  console.dir(andThose);
  console.log(__dirname);
  return;
}

doSomeStuff('something special',trailing,[why]);
function somemagic(a:number,b:number){
  return a+b;
}
console.log('the magic is: '+somemagic(5,7))
// TODO: more examples
console.log('hello!')
console.log('dogo')

const result = add(25)
console.log(result)