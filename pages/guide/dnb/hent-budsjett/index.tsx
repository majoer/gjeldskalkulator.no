import Badge from "@mui/material/Badge";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import AppGuideCardComponent from "../../../../components/guide/app-guide-card-component";
import AppLoadingButton from "../../../../components/io/app-loading-button-component";
import { steps } from "../../index";

export default function AppGuideDnbGetBudgetPage() {
  const { t } = useTranslation(["guide", "calculator"]);

  return (
    <AppGuideCardComponent steps={steps} currentStep={1}>
      <>
        <CardContent>
          <br />

          <div>
            <div className="text-left inline-block">
              <Typography>
                <Badge badgeContent={1} color="success" />
                <span className="ml-4">{t("guide:dnb.downloadBudget.1")}</span>
              </Typography>

              <Typography>
                <Badge badgeContent={2} color="primary" />
                <span className="ml-4">{t("guide:dnb.downloadBudget.2")}</span>
              </Typography>

              <Typography>
                <Badge badgeContent={3} color="secondary" />
                <span className="ml-4">{t("guide:dnb.downloadBudget.3")}</span>
              </Typography>
            </div>
            <br />
            <img src="/dnb0.png" alt="DnB first step" className="w-full sm:w-2/3" />
          </div>

          <Divider className="my-10" />

          <div className="text-left inline-block">
            <Typography>
              <Badge badgeContent={4} color="primary" />
              <span className="ml-4">{t("guide:dnb.downloadBudget.4")}</span>
            </Typography>
          </div>
          <br />
          <div>
            <img src="/dnb1.png" alt="DnB second step" className="w-full sm:w-2/3" />
          </div>

          <Divider className="my-10" />

          <div className="text-left inline-block">
            <Typography>
              <Badge badgeContent={5} color="primary" />
              <span className="ml-4">{t("guide:dnb.downloadBudget.5")}</span>
            </Typography>

            <Typography>
              <Badge badgeContent={6} color="secondary" />
              <span className="ml-4">{t("guide:dnb.downloadBudget.6")}</span>
            </Typography>

            <Typography>
              <Badge badgeContent={7} color="warning" />
              <span className="ml-4">{t("guide:dnb.downloadBudget.7")}</span>
            </Typography>
          </div>
          <br />
          <div>
            <img src="/dnb2.png" alt="DnB third step" className="w-full" />
          </div>
        </CardContent>
        <CardActions className="justify-between mt-4">
          <AppLoadingButton
            variant="contained"
            color="secondary"
            LinkComponent={Link}
            href="/guide"
          >
             {t("guide:backButton.text")}
          </AppLoadingButton>

          <AppLoadingButton
            variant="contained"
            LinkComponent={Link}
            href="/guide/dnb/importer-budsjett"
          >
            {t("guide:dnb.downloadBudget.button.text")}
          </AppLoadingButton>
        </CardActions>
      </>
    </AppGuideCardComponent>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "guide", "calculator"])),
    },
  };
}
