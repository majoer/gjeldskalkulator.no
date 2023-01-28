import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";
import Link from "next/link";
import AppPageLayoutComponent from "../../components/layout/app-page-layout-component";

export default function AppRefinansieringPage() {
  const { t } = useTranslation(["guide"]);
  return (
    <AppPageLayoutComponent
      title={t("guide:refinance.title")}
      description={t("guide:refinance.description")}
    >
      <Typography>{t("guide:refinance.description")}</Typography>

      <br />
      <div>
        <Button
          variant="contained"
          color="primary"
          className="text-white"
          LinkComponent={Link}
          href="/kalkulator"
        >
          {t("guide:refinance.toCalculatorButton.text")}
        </Button>
      </div>
      <br />
    </AppPageLayoutComponent>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "guide"])),
    },
  };
}
