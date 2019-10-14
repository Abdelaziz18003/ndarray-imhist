'use strict';
const fs = require('fs');
const { spawn } = require('child_process');

const minGrayLevel = 0;
const maxGrayLevel = 255;

const defaultOptions = {
  channel: 0,
  color: 'blue',
  plot: true
}

function imhist (ndarray, options) {
  validateInput(ndarray)
  options = Object.assign({}, defaultOptions, options);
  const grayLevels = range(minGrayLevel, maxGrayLevel);
  const frequencies = new Array((maxGrayLevel - minGrayLevel) + 1);
  const shape = ndarray.shape;
  const channel = shape[2] ? options.channel: ndarray.data.indexOf(ndarray.get(0, 0));

  frequencies.fill(0);

  for (let i = channel; i < ndarray.data.length; i = i + (shape[2] || 4)) {
    frequencies[ndarray.data[i]]++;
  }

  // plot the histogram using gnuplot 
  if (options.plot) {
    let dataFileName = `ndarray-hist-data-${Math.round(Math.random() * 1000)}.dat`;
    writeDataFile(dataFileName, grayLevels, frequencies)
      .on('close', () => {
        plotDataFile(dataFileName, options)
          .on('close', () => {
            clearDataFile(dataFileName);
          })
      })
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

function writeDataFile (dataFileName, grayLevels, frequencies) {
  let dataFile = fs.createWriteStream(`./${dataFileName}`);
  grayLevels.forEach(level => {
    dataFile.write(`${level} ${frequencies[level]}\n`);
  })
  dataFile.end();
  return dataFile;
}

function plotDataFile (dataFileName, {color}) {
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`set xrange [${minGrayLevel}:${maxGrayLevel}]\n`);
  gnuplot.stdin.write(`plot "${dataFileName}" with impulses lc rgbcolor "${color}" notitle\n`);
  gnuplot.stdin.end();
  return gnuplot;
}

function clearDataFile (dataFileName) {
  fs.unlinkSync(`${dataFileName}`);
}

module.exports = imhist;