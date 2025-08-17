"use client";
import { useRouter } from "next/navigation";
import { OrganizationSetupForm } from "@md/web-console/components/organization-setup-form";

export default () => {
  const router = useRouter();
  return (
    <OrganizationSetupForm
      onClose={() => {
        router.replace(`/`);
      }}
    />
  );
};
