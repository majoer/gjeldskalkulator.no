import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AppDebtInsightComponent from "../../components/app-debt-insight";
import AppUserInputComponent from "../../components/app-user-input-component";
import AppPageLayoutComponent from "../../components/layout/app-page-layout-component";

export default function CalculatorPage() {
  const { t } = useTranslation(["common", "calculator"]);

  return (
    <AppPageLayoutComponent
      title={t("calculator:title")}
      description={t("calculator:description")}
      showH1={false}
      align="text-left"
    >
      <div className="w-full xl:w-1/2 mb-4 xl:mb-0 bg-slate-100">
        <AppUserInputComponent />
      </div>
      <div className="w-full xl:w-1/2 static top-20 xl:fixed xl:bottom-0 xl:right-0">
        <AppDebtInsightComponent />
      </div>
    </AppPageLayoutComponent>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "calculator"])),
    },
  };
}
