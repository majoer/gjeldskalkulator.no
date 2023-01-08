import Calculate from "@mui/icons-material/Calculate";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { CardMedia, Container } from "@mui/material";

export default function LandingPage() {
  const { t } = useTranslation(["common", "landing"]);

  return (
    <main className="w-full h-screen text-center bg-slate-100">
      <Box className="w-full h-1/4"></Box>
      <div className="w-full h-2/4">
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
          <CardContent></CardContent>
          <CardActions className="justify-center">
            <Button
              className="w-full sm:w-3/12"
              LinkComponent={Link}
              href="/kalkulator"
              variant="contained"
            >
              {t("landing:goToCalculator")}
            </Button>
          </CardActions>
        </Card>
      </div>
      <Box className="w-full h-1/4"></Box>
    </main>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "landing"])),
    },
  };
}
