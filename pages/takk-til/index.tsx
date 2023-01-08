import {
  Avatar,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";

export default function AppContributionsPage() {
  const { t } = useTranslation(["common", "contributions"]);

  return (
    <Container className="pt-20 m-auto text-center">
      <Typography variant="h2" className="mb-10">
        {t("contributions:header")}
      </Typography>
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
                  <Link
                    href="https://www.flaticon.com/free-icons/debt"
                    title="Page icon"
                  >
                    {t("contributions:logo-attribution")}
                  </Link>
                </Typography>
              </>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </Container>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contributions"])),
    },
  };
}
