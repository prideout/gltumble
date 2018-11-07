import { vec3, quat } from 'gl-matrix';

const TWOPI = 2 * Math.PI;

export default class Trackball {
    constructor() {
        this.defaults = Object.freeze({
            startSpin: 0.001, // radians per second
            allowTilt: true,
            allowSpin: true,
            spinFriction: 0.125, // 0 means no friction (infinite spin) while 1 means no inertia
            epsilon: 3, // distance (in pixels) to wait before deciding if a drag is a Tilt or a Spin
            radiansPerPixel: V2.make(0.01, 0.01),
            trackpad: true,  // if true, compensate for the delay on trackpads that occur between touchup and mouseup
            lockAxes: false, // if true, don't allow simultaneous spin + tilt
            homeTilt: 0.25,
        });
    }
}
