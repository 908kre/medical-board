import NextAuth from "next-auth";
import { z } from "zod";
import CognitoProvider from "next-auth/providers/cognito";

const refreshAccessToken = async (token: { refreshToken: string }) => {
  const res = await fetch(`${process.env.COGNITO_DOMAIN_URL}/oauth2/token`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.COGNITO_CLIENT_ID ?? "",
      client_secret: process.env.COGNITO_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    }),
    method: "POST",
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }
  const newToken = z
    .object({
      access_token: z.string(),
      expires_in: z.number(),
      refresh_token: z.optional(z.string()),
    })
    .parse(await res.json());
  return {
    accessToken: newToken.access_token,
    refreshToken: newToken.refresh_token ?? token.refreshToken,
    accessTokenExpires: Date.now() + newToken.expires_in * 1000,
  };
};

const handler = (() => {
  return NextAuth({
    pages: {
      error: "/auth/error",
    },
    providers: [
      CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID || "",
        clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
        issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
        checks: ["none"],
      }),
    ],
    callbacks: {
      jwt: async ({ token, account }) => {
        if (
          account?.access_token &&
          account?.expires_at &&
          account?.refresh_token
        ) {
          return {
            accessToken: account.access_token,
            accessTokenExpires: account.expires_at,
            refreshToken: account.refresh_token,
          };
        }
        if (
          token?.refreshToken &&
          token?.accessTokenExpires &&
          Date.now() > token?.accessTokenExpires
        ) {
          const newToken = await refreshAccessToken({
            refreshToken: token.refreshToken,
          });

          return {
            ...token,
            ...newToken,
          };
        }
        return token;
      },
      session: async ({ session, token }) => {
        session.accessToken = token.accessToken;
        return session;
      },
    },
  });
})();

export { handler as GET, handler as POST };
