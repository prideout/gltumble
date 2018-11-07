import {terser} from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';

const config = (file, plugins) => ({
    input: 'index.js',
    output: {
        name: 'gltumble',
        format: 'umd',
        file
    },
    plugins
});

const bubleConfig = {transforms: {dangerousForOf: true}};

export default [
    config('gltumble.js', [resolve(), buble(bubleConfig)]),
    config('gltumble.min.js', [resolve(), terser(), buble(bubleConfig)])
];
