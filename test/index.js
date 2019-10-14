const test = require('tape');
const getPixels = require('get-pixels');
const imhist = require('../index');

test('Basic tests', (t) => {
  t.throws(
    () => imhist([1, 2, 3], {plot: false}),
    /to be an ndarray/,
    'imhist of non ndarray inputs should throw'
  );
  t.end();
});

test('Tests on lena_gray_256.png image', (t) => {
  getPixels('test/lena_gray_256.png', (err, pixels) => {
    const [x, y] = imhist(pixels, {channel: 0, plot: false});
    t.equal(x.length, 256, 'X length should be 256');
    t.equal(y.length, 256, 'Y length should be 256');
    t.equal(y.reduce((a, b) => a + b), 65536, 'Y sum should be equal to 256x256');
    t.end();
  })
});
