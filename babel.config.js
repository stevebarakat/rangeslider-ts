const { BABEL_ENV, DEBUG, NODE_ENV } = process.env;

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        debug: DEBUG,
        loose: true,
        modules:
          BABEL_ENV === "cjs" || NODE_ENV === "test" ? "commonjs" : false,
        useBuiltIns: false,
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
};
