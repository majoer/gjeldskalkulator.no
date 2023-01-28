import CreditCard from "@mui/icons-material/CreditCard";
import CreditScore from "@mui/icons-material/CreditScore";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import House from "@mui/icons-material/House";
import Savings from "@mui/icons-material/Savings";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import AppClickableCardComponent from "../components/io/app-clickable-card-component";

export default function LandingPage() {
  const { t } = useTranslation(["common", "landing", "guide"]);

  return (
    <div className="w-full text-center m-auto">
      <Head>
        <title>Lånekalkulator, budsjetthjelp og tips til refinansiering av kreditt</title>
        <meta
          name="description"
          content="Har du lite oversikt over økonomien, men vet ikke hvor du skal starte? Prøv vår lånekalkulator for å se når du kan bli gjeldsfri."
        />
      </Head>
      <Typography variant="h1" className="py-10">
        {t("landing:title")}
      </Typography>
      <div className="inline-grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <AppClickableCardComponent href="/guide/bil">
          <CardHeader title={t("guide:car.title")} />
          <CardMedia>
            <DirectionsCar className="w-36 h-36" color="primary" />
          </CardMedia>
        </AppClickableCardComponent>
        <AppClickableCardComponent href="/guide/bolig">
          <CardHeader title={t("guide:house.title")} />
          <CardMedia>
            <House className="w-36 h-36" color="primary" />
          </CardMedia>
        </AppClickableCardComponent>
        <AppClickableCardComponent href="/guide/kreditt">
          <CardHeader title={t("guide:credit.title")} />
          <CardMedia>
            <CreditCard className="w-36 h-36" color="primary" />
          </CardMedia>
        </AppClickableCardComponent>
        <AppClickableCardComponent href="/guide/budsjett">
          <CardHeader title={t("guide:budget.title")} />
          <CardMedia>
            <Savings className="w-36 h-36" color="primary" />
          </CardMedia>
        </AppClickableCardComponent>
        <AppClickableCardComponent href="/guide/refinansiering">
          <CardHeader title={t("guide:refinance.title")} />
          <CardMedia>
            <CreditScore className="w-36 h-36" color="primary" />
          </CardMedia>
        </AppClickableCardComponent>
        <AppClickableCardComponent href="/kalkulator">
          <CardHeader title={t("landing:goToCalculator")} />
          <CardMedia>
            <img src="/debt.png" alt="debt" width="120"></img>
          </CardMedia>
        </AppClickableCardComponent>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "landing", "guide"])),
    },
  };
}
