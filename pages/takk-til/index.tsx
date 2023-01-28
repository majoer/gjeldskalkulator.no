import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";
import AppPageLayoutComponent from "../../components/layout/app-page-layout-component";

export default function AppContributionsPage() {
  const { t } = useTranslation(["common", "contributions"]);

  return (
    <AppPageLayoutComponent
      title={t("contributions:header")}
      description={t("contributions:description")}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          margin: "auto",
        }}
      >
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Page icon" variant="square" src="/debt.png" />
          </ListItemAvatar>
          <ListItemText
            primary="Freepik - Flaticon"
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  <Link href="https://www.flaticon.com/free-icons/debt" title="Page icon">
                    {t("contributions:logo-attribution")}
                  </Link>
                </Typography>
              </>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </AppPageLayoutComponent>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contributions"])),
    },
  };
}
