import test from 'tape';
import Trackball from './index.js';

test('smoke', (t) => {
    const trackball = new Trackball(null, {autoTick: false});
    t.notSame(trackball, null);
    t.end();
});
