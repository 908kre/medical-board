import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.tsx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-toolbars"],
  framework: "@storybook/nextjs",
  refs: {
    "@chakra-ui/react": { disable: true },
  },
  env: (v) => ({
    ...v,
    STORYBOOK: "storybook",
  }),
};

export default config;
