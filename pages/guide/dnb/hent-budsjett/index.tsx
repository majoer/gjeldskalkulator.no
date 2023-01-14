import Info from "@mui/icons-material/Info";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import AppGuideCardComponent from "../../../../components/guide/app-guide-card-component";
import { steps } from "../../index";

export default function AppGuideDnbGetBudgetPage() {
  const { t } = useTranslation(["guide", "calculator"]);

  return (
    <AppGuideCardComponent steps={steps} currentStep={1}>
      <>
        <CardContent>
          <br />

          <div>
            <div className="text-left m-auto w-1/2">
              <Typography>
                <span>{t("guide:dnb.downloadBudget.1")}</span>
              </Typography>
              <Typography>
                <span>{t("guide:dnb.downloadBudget.2")}</span>
                <Tooltip
                  title={t("guide:dnb.downloadBudget.2")}
                  color="primary"
                >
                  <Info />
                </Tooltip>
              </Typography>

              <Typography>
                <span>{t("guide:dnb.downloadBudget.3")}</span>
                <Tooltip
                  title={t("guide:dnb.downloadBudget.3")}
                  color="secondary"
                >
                  <Info />
                </Tooltip>
              </Typography>
            </div>
            <br />
            <img
              src="/dnb0.png"
              alt="DnB first step"
              className="w-full sm:w-2/3"
            />
          </div>

          <Divider className="my-14" />

          <div className="text-left m-auto w-1/2">
            <Typography>
              <span>{t("guide:dnb.downloadBudget.4")}</span>
              <Tooltip title={t("guide:dnb.downloadBudget.4")} color="primary">
                <Info />
              </Tooltip>
            </Typography>
          </div>
          <br />
          <div>
            <img
              src="/dnb1.png"
              alt="DnB second step"
              className="w-full sm:w-2/3"
            />
          </div>

          <Divider className="my-14" />

          <div className="text-left m-auto w-1/2">
            <Typography>
              <span>{t("guide:dnb.downloadBudget.5")}</span>
              <Tooltip title={t("guide:dnb.downloadBudget.5")} color="primary">
                <Info />
              </Tooltip>
            </Typography>

            <Typography>
              <span>{t("guide:dnb.downloadBudget.6")}</span>
              <Tooltip
                title={t("guide:dnb.downloadBudget.6")}
                color="secondary"
              >
                <Info />
              </Tooltip>
            </Typography>

            <Typography>
              <span>{t("guide:dnb.downloadBudget.7")}</span>
              <Tooltip title={t("guide:dnb.downloadBudget.7")} color="warning">
                <Info />
              </Tooltip>
            </Typography>
          </div>
          <br />
          <div>
            <img src="/dnb2.png" alt="DnB third step" className="w-full" />
          </div>

          <Divider className="my-14" />
        </CardContent>
        <CardActions className="justify-between">
          <Button
            variant="contained"
            color="secondary"
            LinkComponent={Link}
            href="/guide"
          >
             {t("guide:backButton.text")}
          </Button>

          <Button
            variant="contained"
            LinkComponent={Link}
            href="/guide/dnb/importer-budsjett"
          >
            {t("guide:dnb.downloadBudget.button.text")}
          </Button>
        </CardActions>
      </>
    </AppGuideCardComponent>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "guide",
        "calculator",
      ])),
    },
  };
}
