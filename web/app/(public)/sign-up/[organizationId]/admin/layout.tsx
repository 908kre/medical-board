"use client";
import { ModalLayout } from "@md/web-console/components/modal-layout";
export default (props: { children: React.ReactNode }) => {
  return <ModalLayout>{props.children}</ModalLayout>;
};
