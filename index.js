import {mat3, mat4, vec2} from 'gl-matrix';

function m3rotation(radians, axis) {
    return mat3.fromMat4(mat3.create(), mat4.fromRotation(mat4.create(), radians, axis));
}

const DEFAULTS = Object.freeze({
    autoTick: true,   // if false, clients must call the tick method once per frame
    startSpin: 0.02, // radians per second
    allowTilt: true,
    allowSpin: true,
    spinFriction: 0.125, // 0 means no friction (infinite spin) while 1 means no inertia
    epsilon: 3, // distance (in pixels) to wait before deciding if a drag is a Tilt or a Spin
    radiansPerPixel: [0.01, 0.01],
    trackpad: true,  // if true, compensate for the delay on trackpads that occur between touchup and mouseup
    lockAxes: false, // if true, don't allow simultaneous spin + tilt
    homeTilt: 0.25,
});

const STATES = Object.freeze({
    Resting: 0,
    SpinningStart: 1,
    SpinningInertia: 2,
    DraggingInit: 3,
    DraggingSpin: 4,
    DraggingTilt: 5,
});

export default class Trackball {
    // Optionally takes a DOM element for listening to pointer events.
    // If no element is provided, clients must call the "mouse" or "processEvent" methods manually.
    constructor(el, options) {
        this.config = {};
        Object.assign(this.config, DEFAULTS);
        Object.assign(this.config, options);
        this.config = Object.freeze(this.config);
        if (this.config.autoTick) {
            this.tick = this.tick.bind(this);
            window.requestAnimationFrame(this.tick);
        }
        if (el) {
            const handler = this.mouse.bind(this);
            el.addEventListener('wheel', handler);
            el.addEventListener('pointermove', handler);
            el.addEventListener('pointerdown', handler);
            el.addEventListener('pointerup', handler);
        }
        this.startPosition = [0, 0];
        this.currentPosition = [0, 0];
        this.previousPosition = this.currentPosition.slice();
        this.previous2Position = this.currentPosition.slice();
        this.currentSpin = 0;
        this.currentTilt = this.config.homeTilt;
        this.currentState = this.config.startSpin ? STATES.SpinningInertia : STATES.Resting;
        this.previousTime = null;
        this.inertiaSpeed = this.config.startSpin;
        this.initialInertia = 0.125;
        Object.seal(this);
    }
    mouse(evt) {
        if (evt.pointerType === 'touch' && !evt.isPrimary) {
            return;
        }
        const pos = [evt.clientX, evt.clientY];
        const del = [evt.deltaX || 0, evt.deltaY || 0];
        if (evt.type === 'pointerdown') {
            this.startDrag(pos);
        }
        if (evt.type === 'pointerup') {
            this.endDrag(pos);
        }
        if (evt.type === 'pointermove' && evt.buttons) {
            this.updateDrag(pos);
        }
    }
    tick() {
        if (this.config.autoTick) {
            this.tick = this.tick.bind(this);
            window.requestAnimationFrame(this.tick);
        }
        const time = Date.now();
        if (this.previousTime == null) {
            this.previousTime = time;
        }
        const deltaTime = time - this.previousTime;
        this.previousTime = time;

        const isSpinning = this.currentState === STATES.DraggingSpin ||
                (this.currentState === STATES.DraggingInit && !this.config.lockAxes);

        if (this.currentState === STATES.SpinningStart) {
            this.currentSpin += this.config.startSpin * deltaTime;
        } else if (this.currentState === STATES.SpinningInertia) {
            this.currentSpin += this.inertiaSpeed * deltaTime;
            this.inertiaSpeed *= (1 - this.config.spinFriction);
            if (Math.abs(this.inertiaSpeed) < 0.0001) {
                this.currentState = STATES.Resting;
            }

        // Some trackpads have an intentional delay between fingers-up
        // and the time we receive the mouseup event.  To accomodate this,
        // we execute inertia even while we think the mouse is still down.
        // This behavior can be disabled with the "trackpad" config option.
        } else if (this.config.trackpad && isSpinning &&
                    vec2.equals(this.currentPosition, this.previous2Position)) {
            this.currentSpin += this.inertiaSpeed * deltaTime;
            this.inertiaSpeed *= (1 - this.config.spinFriction);
        }
        this.previous2Position = this.previousPosition.slice();
        this.previousPosition = this.currentPosition.slice();
    }
    startDrag(position) {
        this.startPosition = position.slice();
        this.currentPosition = position.slice();
        this.currentState = STATES.DraggingInit;
    }
    updateDrag(position) {
        const delta = vec2.subtract(vec2.create(), position, this.startPosition);
        const config = this.config;

        // If we haven't decided yet, decide if we're spinning or tilting.
        if (this.currentState === STATES.DraggingInit && config.lockAxes) {
            if (Math.abs(delta[0]) > config.epsilon && config.allowSpin) {
                this.currentState = STATES.DraggingSpin;
            } else if (Math.abs(delta[1]) > config.epsilon && config.allowTilt) {
                this.currentState = STATES.DraggingTilt;
            } else {
                return;
            }
        }

        const previousSpin = this.getAngles()[0];
        this.currentPosition = position.slice();

        // This is purely for trackpads:
        const spinDelta = this.getAngles()[0] - previousSpin;
        this.inertiaSpeed = this.initialInertia * spinDelta;
    }
    getAngles() {
        const delta = vec2.subtract(vec2.create(), this.currentPosition, this.startPosition);
        const config = this.config;
        let spin = this.currentSpin;
        let tilt = this.currentTilt;
        if (this.currentState === STATES.DraggingSpin) {
            spin += config.radiansPerPixel[0] * delta[0];
        } else if (this.currentState === STATES.DraggingTilt) {
            tilt += config.radiansPerPixel[1] * delta[1];
        } else if (!config.lockAxes && this.currentState === STATES.DraggingInit) {
            spin += config.radiansPerPixel[0] * delta[0];
            tilt += config.radiansPerPixel[1] * delta[1];
        }
        return [spin, tilt];
    }
    getRotation() {
        const r = this.getAngles();
        const spin = m3rotation(r[0], [0, 1, 0]);
        const tilt = m3rotation(r[1], [1, 0, 0]);
        return mat3.multiply(tilt, tilt, spin);
    }
    getMatrix() {
        const r = this.getAngles();
        const spin = mat4.fromRotation(mat4.create(), r[0], [0, 1, 0]);
        const tilt = mat4.fromRotation(mat4.create(), r[1], [1, 0, 0]);
        return mat4.multiply(tilt, tilt, spin);
    }
    // When releasing the mouse, capture the current rotation and change
    // the state machine back to Resting or SpinningInertia.
    endDrag(position) {
        console.info('endDrag');
        const previousSpin = this.getAngles()[0];
        this.currentPosition = position.slice();
        [this.currentSpin, this.currentTilt] = this.getAngles();
        const spinDelta = this.currentSpin - previousSpin;
        if (this.config.spinFriction === 1) {
            this.currentState = STATES.Resting;
        } else {
            this.currentState = STATES.SpinningInertia;
            this.inertiaSpeed = this.initialInertia * spinDelta;
        }
    }
}
