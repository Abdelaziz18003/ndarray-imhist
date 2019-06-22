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

### Syntax

```js
imhist(img [, options]);
// or
let [x, y] = imhist(img [, options]);
```

displays the histogram of a grayscale image `img` (should be an [ndarray](https://github.com/scijs/ndarray)) and return the historgram data as an array of two arrays containing `x` and `y` values respectively.

### Options

Option  | required | default | description
------- | -------- | ------- | -----------
channel | no       | 0       | Select the RGB channel to get the historgram for. `0` for the red channel, `1` for the green and `2` for the blue one. If `img` is a 2D array, this option has no effect.
color   | no       | "blue"  | Set the impulses color, must be a valid Gnuplot "rgbcolor". Otherwise, plotting will fail silently
plot    | no       | true    | If true, plot the histogram using Gnuplot. Otherwise, return just the histogram data.


### Examples

```js
const getPixels = require("get-pixels");
const imhist = require("ndarray-imhist");

getPixels("lena.png", function(err, pixels) {
  if(!err && pixels) {
    // show the image histogram
    imhist(pixels);

    // return the image histogram data without plotting it.
    let [x, y] = imhist(pixels, {plot: false});
    console.log(x, y);
  }
})
```

Here is how the histogram will look like: 

![ndarray-imhist](https://user-images.githubusercontent.com/11301627/59524131-02eb6f80-8ecb-11e9-893d-90c39f50e800.png)
