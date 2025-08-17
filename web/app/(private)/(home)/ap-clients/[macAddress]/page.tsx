"use client";
import { ApClientDetail } from "@md/web-console/components/ap-client-detail";
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
    <ApClientDetail
      macAddress={MacAddress(parsed.macAddress)}
      onClose={() => router.push(`/ap-clients?${searchParams.toString()}`)}
    />
  );
};
