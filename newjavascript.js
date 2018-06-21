"use strict";

// create an ArrayBuffer with a size in bytes
var buffer = new ArrayBuffer(4);

console.log(buffer.byteLength);
// expected output: 8

buffer = "выф";
console.log(buffer);

