"use client";
import { SiteDetail } from "@md/web-console/components/site-detail";
import { SiteId } from "@md/core/domain/site-id";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";

export default () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const parsed = z
    .object({
      siteId: z.string(),
    })
    .parse(params);
  return (
    <SiteDetail
      siteId={SiteId(parsed.siteId)}
      onClose={() => router.push(`/sites?${searchParams.toString()}`)}
    />
  );
};
