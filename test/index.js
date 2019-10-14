const test = require('tape');
const ndarray = require('ndarray');
const getPixels = require('get-pixels');
const pool = require('ndarray-scratch');
const imhist = require('../index');

test('Basic tests', (t) => {
  t.throws(
    () => imhist([1, 2, 3], {plot: false}),
    /to be an ndarray/,
    'imhist of non ndarray inputs should throw'
  )
  t.end()
});

test('Images tests', (t) => {
  getPixels('test/lena_gray_256.png', (err, pixels) => {
    const [x1, y1] = imhist(pixels, {channel: 0, plot: false});
    t.equal(x1.length, 256, 'X length should be 256');
    t.equal(y1.length, 256, 'Y length should be 256');
    t.end();
  })
});
