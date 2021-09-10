const ts = require("typescript");
const ReactDocgenTypescriptPlugin = require("react-docgen-typescript-plugin")
  .default;

module.exports = {
  plugins: [
    // Will default to loading your root tsconfig.json
    new ReactDocgenTypescriptPlugin(),
  ],
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/preset-create-react-app"],
};
