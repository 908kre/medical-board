import { HStack, Spacer } from "@chakra-ui/react";

export const Header = (props: { children?: React.ReactNode }) => {
  return (
    <HStack
      as="nav"
      align="center"
      width="100%"
      bg={"bg.emphasized"}
      padding={2}
      gap={2}
      shadow="md"
    >
    </HStack>
  );
};
