"use client";
import { Layout } from "@md/web-console/components/layout";
import { Header } from "@md/web-console/components/header";

const RootLayout = (props: { children: React.ReactNode }) => {
  return <Layout header={<Header />}>{props.children}</Layout>;
};
export default RootLayout;
