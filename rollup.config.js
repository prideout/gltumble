import {terser} from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

const config = (file, plugins) => ({
    input: 'index.js',
    output: {
        name: 'Trackball',
        format: 'umd',
        file
    },
    plugins
});

const bubleConfig = {transforms: {dangerousForOf: true}};

export default [
    config('docs/gltumble.js', [resolve(), buble(bubleConfig)]),
    config('docs/gltumble.min.js', [resolve(), terser(), buble(bubleConfig)])
];
