"use client";
import { LocalMapDetail } from "@md/web-console/components/local-map-detail";
import { LocalMapId } from "@md/core/domain/local-map-id";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";

export default () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const parsed = z
    .object({
      localMapId: z.string(),
    })
    .parse(params);
  return (
    <LocalMapDetail
      localMapId={LocalMapId(parsed.localMapId)}
      onClose={() => router.push(`/local-maps?${searchParams.toString()}`)}
    />
  );
};
