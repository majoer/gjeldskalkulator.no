import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";
import AppPageLayoutComponent from "../../components/layout/app-page-layout-component";

export default function AppKontaktOssPage() {
  const { t } = useTranslation(["common", "contact-us"]);

  return (
    <AppPageLayoutComponent
      title={t("contact-us:header")}
      description={t("contact-us:description")}
    >
      <List
        sx={{
          width: "280px",
          bgcolor: "background.paper",
          margin: "auto",
        }}
      >
        <ListItem className="inline-block">
          <div className="text-center">
            <Link href="https://github.com/majoer/gjeldskalkulator.no/issues">
              <img src="/github.png" alt="Github - Majoer" width="200" />
            </Link>
            <Typography variant="body2" color="text.secondary">
              {t("contact-us:github")}
            </Typography>
          </div>
        </ListItem>
        <Divider component="li" />
      </List>
    </AppPageLayoutComponent>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contact-us"])),
    },
  };
}
