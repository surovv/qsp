const isObject = elem => Object.prototype.toString.call(elem) === '[object Object]';

const flatten = array => array.reduce((flatted, item) => flatted.concat(Array.isArray(item) ? flatten(item) : item), []);


const convertKeyValToQuery = (key, val) => `${key}=${val}`;
const convertNestedKeyValToQuery = (key, val) => `[${key}]=${val}`;

const convertArrayKeyValToQuery = (key, val) => `${key}[]=${val}`;
const convertNestedArrayKeyValToQuery = (key, val) => `[${key}][]=${val}`;


//const arrayToQuery = convertKeyVal => (key, array) => array.map(val =>
//  ((convertKeyVal == convertArrayKeyValToQuery && Object.prototype.toString.call(val) === '[object Object]') ?
//    convertElementToQuery : convertNestedElementToQuery)(key, val, convertKeyVal));
//arrayToQuery(convertArrayKeyValToQuery);
//arrayToQuery(convertNestedArrayKeyValToQuery)
const convertArrayToQuery = (key, array) =>
  array.map(elem => (isObject(elem) ? convertElementToQuery : convertNestedElementToQuery)(key, elem, convertArrayKeyValToQuery));
const convertNestedArrayToQuery = (key, array) => array.map(elem => convertNestedElementToQuery(key, elem, convertNestedArrayKeyValToQuery));


// deepest val
const appendRootKeyToNestedElement = (rkey, elem) => Array.isArray(elem) ? elem.map(elm => appendRootKeyToNestedElement(rkey, elm)) : `${rkey}${elem}`;
const appendRootKey = (rkey, nestedElements) => [].concat(nestedElements).map(elem => appendRootKeyToNestedElement(rkey, elem));


const convertObjectToQuery = (rkey, obj) =>
  Object.keys(obj).map(key => convertNestedElementToQuery(key, obj[key], convertNestedKeyValToQuery))
    .map(nestedStrings => appendRootKey(rkey, nestedStrings));

const appendNestedKey = (key, elem) => Array.isArray(elem) ? elem.map(elm => appendNestedKey(key, elm)) : `[${key}]${elem}`;
const convertNestedObjectToQuery = (key, obj) =>
  Object.keys(obj).map(k => convertNestedElementToQuery(k, obj[k], convertNestedKeyValToQuery)).map(elem => appendNestedKey(key, elem));


const typesFunctions = {
  '[object Object]': convertObjectToQuery,
  '[object Array]': convertArrayToQuery
};
const nestedTypesFunctions = {
  '[object Object]': convertNestedObjectToQuery,
  '[object Array]': convertNestedArrayToQuery
};


const elementToQuery = typesFunctions => (key, val, convertSimpleKeyVal) =>
  (typesFunctions[Object.prototype.toString.call(val)] || convertSimpleKeyVal)(key, val);
const convertNestedElementToQuery = elementToQuery(nestedTypesFunctions);
const convertElementToQuery = elementToQuery(typesFunctions);


export const stringify = obj => flatten(Object.keys(obj).map(k => convertElementToQuery(k, obj[k], convertKeyValToQuery))).join('&');

export const parse = query => query.split('&').map(el => el.split('=')).reduce((obj, keyVal) => ({...obj, [keyVal[0]]: keyVal[1]}), {});
