'use strict';
const fs = require('fs');

const minGrayLevel = 0;
const maxGrayLevel = 255;

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
  fs.writeFileSync('./ndarray-hist-data.txt', data, {encoding: 'utf-8'});
}

module.exports = imhist;