import typescript from "rollup-plugin-typescript2";
import transpile from "@rollup/plugin-buble";
import {terser} from "rollup-plugin-terser";
import pkg from "../package.json";

const sourcemap = true;
const external = Object.keys(pkg.peerDependencies || {});

const plugins = [
  typescript(),
  transpile(),
];

// Disabling minification makes faster
// watch and better coverage debugging
if (process.env.NODE_ENV === "production") {
  plugins.push(terser({
      output: {
          comments(node, comment) {
              return comment.line === 1;
          },
      },
      compress: {
          drop_console: true,
      },
  }));
}

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.ts",
    external,
    plugins: plugins,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap,
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap,
      }
    ]
  }
];
