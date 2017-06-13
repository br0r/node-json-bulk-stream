#!/usr/bin/env node

var split = require('split');
var Transform = require('stream').Transform;
var os = require('os');

var n = parseInt(process.argv[2]);
if (!n || n <= 0) exit('Invalid number');

var b = [];
var t = new Transform({
  writableObjectMode: true,
  transform: function (chunk, enc, next) {
    b.push(chunk);
    if (b.length >= n) {
      this.push(JSON.stringify(b.splice(0, n)) + os.EOL);
    }

    next();
  },

  flush: function (cb) {
    if (b.length) {
      this.push(JSON.stringify(b) + os.EOL);
    }

    cb();
  },

});

process.stdin
  .pipe(split(JSON.parse, null, { trailing: false }))
  .on('error', exit)
  .pipe(t)
  .on('error', exit)
  .pipe(process.stdout);

function exit(msg) {
  console.error(msg);
  process.exit(msg ? 1 : 0);
}
