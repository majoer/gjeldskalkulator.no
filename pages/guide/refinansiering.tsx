import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";
import Link from "next/link";

export default function AppRefinansieringPage() {
  const { t } = useTranslation(["guide"]);
  return (
    <div className="text-center m-auto">
      <Typography variant="h1" className="py-10">
        {t("guide:refinance.title")}
      </Typography>
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
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "guide"])),
    },
  };
}
