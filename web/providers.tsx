"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@md/web/theme";
import { Toaster } from "@md/web/components/ui/toaster";
import { DialogProvider } from "@md/web/components/dialog";
import { SWRConfig } from "swr";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
      }}
    >
      <ChakraProvider value={system}>
        <NuqsAdapter>
          <DialogProvider>
            <SessionProvider>{children}</SessionProvider>
          </DialogProvider>
        </NuqsAdapter>
        <Toaster />
      </ChakraProvider>
    </SWRConfig>
  );
};
