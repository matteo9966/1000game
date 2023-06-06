"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doSomeStuff = void 0;
const something_1 = require("./example/something");
console.log('Try npm run lint/fix!');
const longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.';
const trailing = 'Semicolon';
const why = 'am I tabbed?';
function doSomeStuff(withThis, andThat, andThose) {
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
exports.doSomeStuff = doSomeStuff;
doSomeStuff('something special', trailing, [why]);
function somemagic(a, b) {
    return a + b;
}
console.log('the magic is: ' + somemagic(5, 7));
// TODO: more examples
console.log('hello!');
console.log('dogo');
const result = (0, something_1.add)(25);
console.log(result);
//# sourceMappingURL=index.js.map