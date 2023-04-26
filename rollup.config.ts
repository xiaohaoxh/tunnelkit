import { RollupOptions } from 'rollup';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import polyfill from 'rollup-plugin-polyfill-node'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'


const rollupConfig: RollupOptions[] = [{
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'es',
            sourcemap: true
        }
    ],
    external: [],
    plugins: [
        commonjs(),
        polyfill(),
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        ts({
            tsconfig: "tsconfig.json",
            // 默认声明文件放到一个文件夹中
            useTsconfigDeclarationDir: true
        }),
        babel({
            exclude: 'node_modules/**', // 防止打包node_modules下的文件
            babelHelpers: 'bundled'      // 使plugin-transform-runtime生效
        }),
        terser()

    ]
},
{
    input: 'src/index.ts',
    output: {
        file: 'dist/index.d.ts',
        format: 'es'
    },
    plugins: [
        dts()
    ]
}]

export default rollupConfig;
