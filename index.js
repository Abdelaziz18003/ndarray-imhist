'use strict';
const fs = require('fs');
const { spawn } = require('child_process');

const minGrayLevel = 0;
const maxGrayLevel = 255;
const tempFileName = 'ndarray-hist-data.dat';
const defaultOptions = {
  color: 'blue'
}

function imhist (ndarray, options = defaultOptions) {
  const grayImage = ndarray.pick(null, null, 0);
  const grayLevels = range(minGrayLevel, maxGrayLevel);
  const frequencies = new Array(grayLevels.length);

  grayLevels.forEach(level => {
    frequencies[level] = 0;
    for(let i = 0; i < grayImage.shape[0]; i++) {
      for(let j = 0; j < grayImage.shape[1]; j++) {
        if (grayImage.get(i, j) === level) {
          frequencies[level]++;
        }
      }
    }
  })

  writeDataFile(grayLevels, frequencies);
  plotDataFile(options)
    .on('close', () => {
      clearDataFile();
    })
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