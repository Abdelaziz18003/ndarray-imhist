'use strict';
const fs = require('fs');
const { spawn } = require('child_process');

const minGrayLevel = 0;
const maxGrayLevel = 255;
const tempFileName = 'ndarray-hist-data.dat';

const defaultOptions = {
  channel: 0,
  color: 'blue',
  plot: true
}

function imhist (ndarray, options = defaultOptions) {
  const grayLevels = range(minGrayLevel, maxGrayLevel);
  const frequencies = new Array((maxGrayLevel - minGrayLevel) + 1);
  const shape = ndarray.shape;

  frequencies.fill(0);

  for (let i = options.channel; i < ndarray.data.length; i = i + (shape[2] || 1)) {
    frequencies[ndarray.data[i]]++;
  }

  // plot the histogram using gnuplot 
  if (options.plot) {
    writeDataFile(grayLevels, frequencies);
    plotDataFile(options)
      .on('close', () => {
        clearDataFile();
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

function writeDataFile (grayLevels, frequencies) {
  let dataFile = fs.createWriteStream(`./${tempFileName}`);
  grayLevels.forEach(level => {
    dataFile.write(`${level} ${frequencies[level]}\n`);
  })
  dataFile.end();
}

function plotDataFile ({color}) {
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`set xrange [${minGrayLevel}:${maxGrayLevel}]\n`);
  gnuplot.stdin.write(`plot "${tempFileName}" with impulses lc rgbcolor "${color}" notitle\n`);
  gnuplot.stdin.end();
  return gnuplot;
}

function clearDataFile () {
  fs.unlinkSync(`${tempFileName}`);
}

module.exports = imhist;