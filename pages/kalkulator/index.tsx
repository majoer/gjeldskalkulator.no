import Head from "next/head";
import AppDebtInsightComponent from "../../components/app-debt-insight";
import AppUserInputComponent from "../../components/app-user-input-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CalculatorPage() {
  return (
    <div>
    <Head>
      <title>Når blir jeg gjeldsfri? Hvor mye koster min gjeld?</title>
      <meta name="description" content="Prøv den beste gjeldskalkulatoren! Sett opp et budsjett helt enkelt og se hvordan det påvirker hvor mye du kan betale på lån" />
    </Head>
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
