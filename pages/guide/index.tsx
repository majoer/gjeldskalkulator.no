import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router.js";
import { useMemo } from "react";
import AppGuideCardComponent from "../../components/guides/app-guide-card-component";
import AppGuideDnbGetBudgetComponent from "../../components/guides/app-guide-dnb-get-budget-component";
import AppGuideDnbImportBudgetComponent from "../../components/guides/app-guide-dnb-import-budget-component";
import AppGuideSelectBankComponent from "../../components/guides/app-guide-select-bank-component";

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation(["guide", "calculator"]);

  const steps = useMemo(() => {
    return [
      {
        href: "#velg-bank",
        step: t("guide:steps.selectBank.step"),
        title: t("guide:steps.selectBank.title"),
        component: <AppGuideSelectBankComponent />,
      },
      {
        href: "#dnb-hent-budsjett",
        step: t("guide:steps.downloadBudget.step"),
        title: t("guide:steps.downloadBudget.title"),
        component: <AppGuideDnbGetBudgetComponent />,
      },
      {
        href: "#dnb-importer-budsjett",
        step: t("guide:steps.uploadBudget.step"),
        title: t("guide:steps.uploadBudget.title"),
        component: <AppGuideDnbImportBudgetComponent />,
      },
    ];
  }, [t]);

  return <AppGuideCardComponent steps={steps} />;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "guide",
        "calculator",
      ])),
    },
  };
}
