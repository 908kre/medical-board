"use client";

import { useTranslation } from "@md/web-console/i18n";
import { useMemo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Alert, Box, Button, Link, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";

export default () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const host = useMemo(() => {
    return `${window.location.protocol}//${window.location.host}`;
  }, []);

  const onSignIn = async () => {
    if (session?.accessToken) {
      return await signOut({
        callbackUrl: `/api/auth/sign-out?redirect_uri=${host}/organization-setup`,
      });
    }
    await signIn("cognito", {
      callbackUrl: "/organization-setup",
    });
  };

  return (
    <>
      <Box>
        <Alert.Root
          status="success"
          variant="subtle"
          colorScheme="green"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="100vh"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title mt={8} mb={4} fontSize="lg">
              {t("signUpForm:complete:title")}
            </Alert.Title>
            <Alert.Description maxWidth="xl">
              {t("signUpForm:complete:description")}
            </Alert.Description>
            <Box p={8}>
              <Button
                colorScheme="green.500"
                variant="outline"
                onClick={onSignIn}
              >
                {t("common:signIn")}
              </Button>
              <Text mt={10} fontSize="sm">
                {/* TODO: 日本語化 */}※
                メールが届かない場合は、迷惑フォルダをご確認いただくか、再度、
                <Link
                  href={`/sign-up/${organizationId}`}
                  color="blue.500"
                  fontWeight={600}
                >
                  アカウント登録
                </Link>
                を行ってください。
              </Text>
            </Box>
          </Alert.Content>
        </Alert.Root>
      </Box>
    </>
  );
};
