import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";

export default function AppKontaktOssPage() {
  const { t } = useTranslation(["common", "contact-us"]);

  return (
    <Container className="m-auto text-center">
      <Typography variant="h2" className="mb-10">
        {t("contact-us:header")}
      </Typography>
      <List
        sx={{
          width: "280px",
          bgcolor: "background.paper",
          margin: "auto",
        }}
      >
        <ListItem className="inline-block">
          <div className="text-center">
            <Link href="https://discord.com">
              <img src="/discord.svg" alt="Discord" width="240" />
            </Link>

            <Typography variant="body2" color="text.secondary">
              {t("contact-us:discord")}
            </Typography>
          </div>
        </ListItem>
        <Divider component="li" />
        <ListItem className="inline-block">
          <div className="text-center">
            <Link href="https://github.com/majoer/gjeldskalkulator.no">
              <img src="/github.png" alt="Github - Majoer" width="200" />
            </Link>
            <Typography variant="body2" color="text.secondary">
              {t("contact-us:github")}
            </Typography>
          </div>
        </ListItem>
        <Divider component="li" />
      </List>
    </Container>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contact-us"])),
    },
  };
}
