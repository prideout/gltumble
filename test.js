import test from 'tape';
import Trackball from './index.js';

test('smoke', (t) => {
    const trackball = new Trackball(data);
    t.notSame(trackball, null);
    t.end();
});
