import { Providers } from "../providers";
import { Box } from "@chakra-ui/react";
import { Preview } from "@storybook/react";
import { useTranslation } from "@md/web/i18n";
import { Suspense } from "react";

{/* if (process.env.STORYBOOK) { */}
{/*   replace(); */}
{/* } */}

const withChakra = (StoryFn, context) => {
  const { locale } = context.globals;
  const { setLanguage } = useTranslation();
  setLanguage(locale);
  return <StoryFn />;
};

const withProviders = (StoryFn) => {
  return (
    <Providers>
      <Suspense fallback={<div>loading translations...</div>}>
        <Box
          width="100%"
          height="800px"
          border="1px solid black"
          overflow="auto"
        >
          <StoryFn />
        </Box>
      </Suspense>
    </Providers>
  );
};

export const decorators = [withChakra, withProviders];
const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    chromatic: {
      modes: {
        english: {
          locale: "en",
        },
        japanese: {
          locale: "ja",
        },
      },
      delay: 300,
    },
  },
  globalTypes: {
    locale: {
      description: "インターナショナライゼーション言語",
      toolbar: {
        icon: "globe",
        items: [
          { value: "ja", title: "ja" },
          { value: "en", title: "en" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
