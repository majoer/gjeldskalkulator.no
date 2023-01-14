import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Typography from "@mui/material/Typography";

export default function LandingPage() {
  const { t } = useTranslation(["common", "landing"]);

  return (
    <div className="w-full text-center">
      <div className="w-full h-3/6 xl:mt-32">
        <Card elevation={10} className="lg:w-2/3 xl:w-5/12 lg:m-auto p-6">
          <CardHeader
            title={t("landing:title")}
            subheader={t("landing:subheader")}
            titleTypographyProps={{ component: "h1" }}
            subheaderTypographyProps={{ component: "h2" }}
          />
          <CardMedia
            component="img"
            alt="logo"
            image="/debt.png"
            height="150px"
            sx={{ objectFit: "contain" }}
          ></CardMedia>
          <CardContent>
            <Typography variant="subtitle1">
              {t("landing:subsubheader")}
            </Typography>
          </CardContent>
          <CardActions className="justify-center flex-row flex-wrap w-full">
            <Button
              className="w-full sm:w-5/12 my-3"
              LinkComponent={Link}
              href="/kalkulator"
              variant="contained"
            >
              {t("landing:goToCalculator")}
            </Button>
            <Button
              className="w-full sm:w-5/12 m-0 sm:ml-6"
              color="secondary"
              LinkComponent={Link}
              href="/guide"
              variant="contained"
            >
              {t("landing:goToGuide")}
            </Button>
          </CardActions>
        </Card>
      </div>
      <Box className="w-full h-2/6"></Box>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "landing"])),
    },
  };
}
