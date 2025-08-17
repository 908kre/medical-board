"use client";
import { client } from "@md/web-console/client/client-v1";
import { useEffect } from "react";
import { useSession } from "@md/web-console/hooks/session";
import { useCaller } from "@md/web-console/hooks/caller";
import { Skeleton } from "@chakra-ui/react";
import { useOrganizationId } from "@md/web-console/hooks/organization-id";

const RootLayout = (props: { children: React.ReactNode }) => {
  const { accessToken } = useSession();
  const { caller, mutate } = useCaller();
  const { organizationId, setOrganizationId } = useOrganizationId();
  useEffect(() => {
    client.setAccessToken(accessToken);
    if (accessToken) {
      mutate();
    }
  }, [accessToken]);
  useEffect(() => {
    if (caller && !organizationId) {
      setOrganizationId(caller.organization.id);
    }
  }, [caller, organizationId]);
  return client.hasAccessToken() ? props.children : <Skeleton h="100%" />;
};
export default RootLayout;
