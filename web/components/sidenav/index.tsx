import NextLink from "next/link";
import { LuChartLine} from "react-icons/lu";
import { IconButton, VStack } from "@chakra-ui/react";
import { Tooltip } from "@md/web/components/ui/tooltip";
import { useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "@md/web/hooks";
const menus = [
  {
    icon: <LuChartLine />,
    label: "mock",
    url: "/mock",
  },
];

export const SideNav = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <VStack h="100%" bg={"bg.emphasized"} gap={0} shadow="md">
      {menus.map((x, i) => {
        return (
          <Tooltip
            content={t(x.label)}
            positioning={{ placement: "right" }}
            key={i}
          >
            <IconButton
              asChild
              rounded="none"
              variant={pathname.startsWith(x.url) ? "solid" : "ghost"}
              size={"lg"}
            >
              <NextLink
                href={`${x.url}?${searchParams.toString()}`}
                prefetch={true}
              >
                {x.icon}
              </NextLink>
            </IconButton>
          </Tooltip>
        );
      })}
    </VStack>
  );
};
