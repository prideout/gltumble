<h1>gltumble<img src="https://github.com/prideout/lava/raw/master/extras/assets/klein31416.gif" align="right" width="128"></h1>

[![badge]](https://travis-ci.org/prideout/gltumble)

This library provides a math class called `Trackball` that allows users to tumble an object by
dragging with a mouse, trackpad, or touch screen. It optionally applies inertia such that the object
continues to spin if you flick it.

The trackball does not do anything with quaternions. It simply applies Y rotation (*spin*) followed
by X rotation (*tilt*).

The trackball avoids rotation about the Z axis. Personally, I like this constraint because I rarely
tilt my head in real life. If you find it to be too limiting, try another package such as
[trackball-controller].

- [Interactive Demo] using [Filament] and WebGL 2.0
- The [demo source] is a single file.

Note that `gltumble` emulates the behavior used by [sketchfab.com] except that it does not support
zooming.

## Example

```js
const canvas = document.getElementsByTagName('canvas')[0];
const trackball = new Trackball(canvas);
const mat = trackball.getMatrix();
console.info(`The 4x4 transform looks like: ${mat}.`);
```

## Install

Install with NPM (`npm install gltumble`) or Yarn (`yarn add gltumble`), then:

```js
import Trackball from 'gltumble';
```

Or use one of the following two CDN builds.

```html
<script src="//unpkg.com/gltumble@1.0.1/gltumble.min.js"></script> <!-- minified build -->
<script src="//unpkg.com/gltumble@1.0.1/gltumble.js"></script> <!-- dev build -->
```

## API Reference

#### new Trackball(element, options)

Constructs a trackball, given an optional DOM element and configuration dictionary. Listens to
pointer events on the given DOM element.

#### trackball.getMatrix()

Returns a flat array of 16 numbers representing the current mat4 transformation.

[badge]: https://travis-ci.org/prideout/gltumble.svg?branch=master "Build Status"
[glMatrix]: http://glmatrix.net
[Interactive Demo]: https://prideout.net/gltumble
[Filament]: https://github.com/google/filament
[demo source]: https://github.com/prideout/gltumble/blob/master/docs/index.html
[trackball-controller]: https://github.com/wwwtyro/trackball-controller
[sketchfab.com]: https://sketchfab.com/models/bde956d410d4483da4126f1b0c80a06b
