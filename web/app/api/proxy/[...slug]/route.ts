import { NextRequest, NextResponse } from "next/server";

const CORE_API_URL = process.env.CORE_API_URL ?? "";

const handler = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { slug: string[] };
  },
) => {
  const { slug } = await params;
  const { method, nextUrl } = req;
  const url = CORE_API_URL + "/" + slug.join("/") + (nextUrl.search ?? "");
  const response = await fetch(url, {
    method,
    headers: req.headers,
    body: req.body,
    // @ts-expect-error https://github.com/node-fetch/node-fetch/issues/1769
    duplex: "half",
  });
  return new NextResponse(await response.text(), { status: response.status });
};
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
