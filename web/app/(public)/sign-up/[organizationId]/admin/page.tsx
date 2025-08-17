"use client";
import { useParams, useRouter } from "next/navigation";
import { OrganizationId } from "@md/core/domain/organization-id";
import CreateAdminUserForm from "@md/web-console/components/create-admin-user-form";

export default () => {
  const router = useRouter();
  const { organizationId } = useParams<{ organizationId: OrganizationId }>();

  return (
    <CreateAdminUserForm
      organizationId={organizationId}
      onClose={() => {
        router.replace(`/sign-up/${organizationId}/complete`);
      }}
    />
  );
};
