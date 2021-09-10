#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const { execSync } = require("child_process");

const { NODE_ENV = "production" } = process.env;

const exec = (cmd, env) =>
  execSync(cmd, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });

const extensions = ".js,.jsx,.ts,.tsx";
const ignore = ["**/__stories__", "**/__tests__", "src/testUtils"].join(",");

console.log("\n⚙️  Building ES modules...");
exec(
  `babel --root-mode upward --verbose src --extensions ${extensions} --ignore ${ignore} --out-dir build/es`,
  {
    NODE_ENV,
  }
);

console.log("\n⚙️  Building CJS modules...");
exec(
  `babel --root-mode upward --verbose src --extensions ${extensions} --ignore ${ignore} --out-dir build`,
  {
    BABEL_ENV: "cjs",
    NODE_ENV,
  }
);

console.log("\n⚙️  Generating types...");
exec(`tsc --project ./tsconfig.build.json --emitDeclarationOnly`);
