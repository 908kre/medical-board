"use client";
import { NodeDetail } from "@md/web-console/components/node-detail";
import { MacAddress } from "@md/core/domain/mac-address";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";

export default () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const parsed = z
    .object({
      macAddress: z.string(),
    })
    .parse(params);
  return (
    <NodeDetail
      macAddress={MacAddress(parsed.macAddress)}
      onClose={() => router.push(`/nodes?${searchParams.toString()}`)}
    />
  );
};
