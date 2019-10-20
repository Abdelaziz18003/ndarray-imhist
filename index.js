'use strict';
const { spawn } = require('child_process');

const pool = require('ndarray-scratch');

const minGrayLevel = 0;
const maxGrayLevel = 255;

const defaultOptions = {
  channel: 0,
  color: 'blue',
  plot: true
}

function imhist (ndarray, options) {
  validateInput(ndarray);
  options = Object.assign({}, defaultOptions, options);

  ndarray = ndarray.pick(null, null, options.channel);
  ndarray = pool.clone(ndarray);

  const grayLevels = range(minGrayLevel, maxGrayLevel);
  const frequencies = new Array((maxGrayLevel - minGrayLevel) + 1);

  frequencies.fill(0);

  for (let i = 0; i < ndarray.data.length; i++) {
    frequencies[ndarray.data[i]]++;
  }

  // plot the histogram using gnuplot 
  if (options.plot) {
    plotData(grayLevels, frequencies, options)
  }
  return [grayLevels, frequencies];
}

function range (min, max) {
  let array = [];
  for (let i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
}

function isNdarray (array) {
  return (
    array.hasOwnProperty('data') &&
    array.hasOwnProperty('shape') &&
    array.hasOwnProperty('stride') &&
    array.hasOwnProperty('offset')
  )
}

function validateInput (input) {
  if (!isNdarray(input)) {
    throw new Error('Expected input to be an ndarray');
  }
}

function plotData (grayLevels, frequencies, {color}) {
  let data = '';
  grayLevels.forEach(level => {
    data += `${level} ${frequencies[level]}\n`;
  })
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`set xrange [${minGrayLevel}:${maxGrayLevel}]\n`);
  gnuplot.stdin.write(`plot '-' with impulses lc rgbcolor "${color}" notitle\n`);
  gnuplot.stdin.write(`${data}`);
  gnuplot.stdin.write(`EOF`);
  gnuplot.stdin.end();
  return gnuplot;
}

module.exports = imhist;