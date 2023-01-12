import AppDebtInsightComponent from "../../components/app-debt-insight";
import AppUserInputComponent from "../../components/app-user-input-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CalculatorPage() {
  return (
    <div>
      <div className="w-full xl:w-1/2 mb-4 xl:mb-0 bg-slate-100">
        <AppUserInputComponent />
      </div>
      <div className="w-full xl:w-1/2 static top-20 xl:fixed xl:bottom-0 xl:right-0">
        <AppDebtInsightComponent />
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "calculator"])),
    },
  };
}
