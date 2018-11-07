<h1>gltumble<img src="https://github.com/prideout/lava/raw/master/extras/assets/klein31416.gif" align="right" width="128"></h1>

[![badge]](https://travis-ci.org/prideout/gltumble)

This library provides a math class called `Trackball` that allows users to spin (or "tumble") an
object by dragging with a mouse, trackpad, or touch screen. It optionally applies inertia such that
the object continues to spin if you flick it.

The trackball does not do anything with quaternions. It simply applies Y rotation followed by X
rotation. It avoids rotation about the Z axis, and here's why:

**When I'm at a museum, I often walk around an *objet d'art*, or stand on my tiptoes to see its top,
or crouch to see its underside. However, I very rarely tilt my head to the side, since that doesn't
reveal anything new. The only times I tilt my head are when I'm expressing confusion, or trying to
read vertical text.**

Personally, I like this constraint. If you find it to be too limiting, try another package such
as [trackball-controller].

- [Interactive Demo] using [Filament] and WebGL 2.0
- The demo [source code] is a single JS file.

Note that `gltumble` emulates the behavior used by [sketchfab.com].

## Example

```js
const trackball = new Trackball({foo: bar});
const mat = trackball.getMatrix();
trackball.execute();
console.info(`The first component has ${nverts} vertices.`);
```

## Install

Install with NPM (`npm install gltumble`) or Yarn (`yarn add gltumble`), then:

```js
import Trackball from 'gltumble';
```

Or use one of the following two CDN builds.

```html
<script src="//unpkg.com/gltumble/gltumble.min.js"></script> <!-- minified build -->
<script src="//unpkg.com/gltumble/gltumble.js"></script> <!-- dev build -->
```

## API Reference

#### new Trackball(options)

Constructs a trackball, given an optional configuration dictionary.

#### trackball.touch(...)

TBD.

#### trackball.getTransform(...)

TBD.

[badge]: https://travis-ci.org/prideout/.svg?branch=master "Build Status"
[glMatrix]: http://glmatrix.net
[Interactive Demo]: https://prideout.net/gltumble
[Filament]: https://github.com/google/filament
[source code]: https://github.com/prideout/knotess/blob/master/docs/demo.js
[trackball-controller]: https://github.com/wwwtyro/trackball-controller
[sketchfab.com]: https://sketchfab.com/models/bde956d410d4483da4126f1b0c80a06b
