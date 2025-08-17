"use client";
import { ErrorLayout } from "@md/web-console/components/error-layout";
import { CSR } from "@md/web-console/components/csr";
import { useTranslation } from "@md/web-console/i18n";
import { useRouter } from "next/navigation";

export default function Error() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <CSR>
      <ErrorLayout
        title={t("fatal-description")}
        buttonText={t("back-to-home")}
        onButtonClick={() => router.back()}
      />
    </CSR>
  );
}
