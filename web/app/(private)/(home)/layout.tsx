"use client";
import { Layout } from "@md/web-console/components/layout";
import { SideNav } from "@md/web-console/components/sidenav";
import { Header } from "@md/web-console/components/header";
import { TimeController } from "@md/web-console/components/time-controller";
import { MultiMaps } from "@md/web-console/components/multi-maps";
export default (props: { children: React.ReactNode }) => {
  return (
    <Layout
      header={
        <Header>
          <TimeController />
        </Header>
      }
      sidenav={<SideNav />}
      sidebar={props.children}
    >
      <MultiMaps />
    </Layout>
  );
};
