import { NextResponse, NextRequest } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request: NextRequest) {
  noStore();

  // https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html
  const endpoint = `${process.env.COGNITO_DOMAIN_URL}/logout`;
  const options = {
    client_id: process.env.COGNITO_CLIENT_ID || "",
    redirect_uri: request.nextUrl.searchParams.get("redirect_uri") || "", // Hosted UIで再サインイン後にリダイレクトさせるURI
    response_type: "code", // redirect_uriを指定する場合required
  };
  const params = new URLSearchParams(options);

  return NextResponse.redirect(`${endpoint}?${params.toString()}`, 302);
}
