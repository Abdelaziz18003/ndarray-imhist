'use strict';
const fs = require('fs');
const { exec, spawn } = require('child_process');

const minGrayLevel = 0;
const maxGrayLevel = 255;
const tempFileName = 'ndarray-hist-data.txt';

function imhist (ndarray) {
  const image = ndarray.pick(null, null, 0);
  const grayLevels = range(minGrayLevel, maxGrayLevel);
  const frequencies = new Array(grayLevels.length);

  grayLevels.forEach(level => {
    frequencies[level] = 0;
    for(let i = 0; i < image.shape[0]; i++) {
      for(let j = 0; j < image.shape[1]; j++) {
        if (image.get(i, j) === level) {
          frequencies[level]++;
        }
      }
    }
  })
  writeDataFile(grayLevels, frequencies);
  plotDataFile();
}

function range (min, max) {
  let array = [];
  for (let i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
}

function writeDataFile (grayLevels, frequencies) {
  let data = ''
  grayLevels.forEach(level => {
    data += `${level} ${frequencies[level]}\n`;
  })
  fs.writeFileSync(`./${tempFileName}`, data, {encoding: 'utf-8'});
}

function plotDataFile () {
  let gnuplot = spawn('gnuplot', ['-p']);
  gnuplot.stdin.write(`plot "${tempFileName}" with boxes fill solid 0.5\n`);
  gnuplot.stdin.end();
}

module.exports = imhist;