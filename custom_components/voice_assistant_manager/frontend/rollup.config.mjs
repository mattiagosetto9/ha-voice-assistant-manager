import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/voice-assistant-manager-panel.ts',
  output: {
    file: 'dist/voice-assistant-manager-panel.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({
      compilerOptions: {
        declaration: false,
        declarationMap: false,
      }
    }),
  ],
};
