import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';
import path from 'path';

export default {
    input: 'src/index.ts',
    output: {
        file: path.resolve(__dirname, 'dist/index.js'),
        format: 'es',
        sourcemap: true
    },
    plugins: [
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        ts({
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        })
    ]

}