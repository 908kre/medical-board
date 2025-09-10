"use client";
import { Layout } from "@md/web/components/layout";
import { SideNav } from "@md/web/components/sidenav";
import { Header } from "@md/web/components/header";
export default (props: { children: React.ReactNode }) => {
  return (
    <Layout
      header={
        <Header>
        </Header>
      }
      sidenav={<SideNav />}
      sidebar={props.children}
    >
    </Layout>
  );
};
