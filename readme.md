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
const getPixels = require("get-pixels");
const imhist = require("ndarray-imhist");

// Plotting options
const options = {
  color: "blue" // Impulses color, must be a valid Gnuplot "rgbcolor". Otherwise, plotting will fail silently
}

getPixels("lena.png", function(err, pixels) {
  if(!err && pixels) {
    imhist(pixels, options); // options are not required
  }
})
```

You will get something like that: 

![ndarray-imhist](https://user-images.githubusercontent.com/11301627/59524131-02eb6f80-8ecb-11e9-893d-90c39f50e800.png)
