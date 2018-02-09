Parse and stringify URL and other query strings

# qsp
query string params

## Installation

###  NPM

```sh
npm install --save qsp
```


## Usage

```js
const qsp = require('qsp');

qsp.stringify({key1: 'val1', key2: 'val2'});
//=> 'key1=val1&key2=val2'

// stringify nested attributes
qsp.stringify({key: {nested: [1,2,3,4], doubleNested: {dnKey: 'val'}}, anotherKey: 'simpleVal'});
//=> key[nested][]=1&key[nested][]=2&key[nested][]=3&key[nested][]=4&key[doubleNested][dnKey]=val&anotherKey=simpleVal

qsp.parse('key1=val1&key2=val2')
//=> {key1: 'val1', key2: 'val2'}
```
