# ndarray-imhist

A package to plot grayscale images' histograms using node.js and Gnuplot, inspired by Matlab `imhist` command.

## Installation

```bash
npm install ndarray-imhist
```

[Gnuplot](http://www.gnuplot.info/) is required for this package to work. Make sure that it is installed and added to the path correctly by typing:

```bash
gnuplot --version
```

## Usage

```js
var getPixels = require("get-pixels");
var imhist = require("ndarray-imhist");

getPixels("lena.png", function(err, pixels) {
  if(!err && pixels) {
    imhist(pixels);
  }
})
```

You will get something like that: 

![ndarray-imhist](https://user-images.githubusercontent.com/11301627/59232470-6c723200-8bdc-11e9-873a-ec06825acf52.png)
