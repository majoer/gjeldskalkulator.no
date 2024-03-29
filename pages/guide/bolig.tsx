import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";
import { useRouter } from "next/router";
import AppClickableCardComponent from "../../components/io/app-clickable-card-component";
import AppPageLayoutComponent from "../../components/layout/app-page-layout-component";
import { setAllDebt } from "../../store/debt-slice";
import { setAllExpenses } from "../../store/expense-slice";
import { setAllIncomes } from "../../store/income-slice";
import { useAppDispatch } from "../../store/store";

export default function AppBoliglaanPage() {
  const { t } = useTranslation(["guide"]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <AppPageLayoutComponent
      title={t("guide:house.title")}
      description={t("guide:house.description")}
    >
      <Typography>{t("guide:house.p1")}</Typography>
      <Typography>{t("guide:house.p2")}</Typography>
      <br />
      <Typography>{t("guide:house.p3")}</Typography>
      <br />

      <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 gap-10 md:w-4/6 xl:w-3/6 m-auto mb-2">
        <AppClickableCardComponent
          href="/kalkulator"
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setAllIncomes([
                {
                  id: nanoid(),
                  name: "Jobb 1",
                  amount: 30000,
                },
                {
                  id: nanoid(),
                  name: "Jobb 2",
                  amount: 30000,
                },
              ])
            );
            dispatch(setAllExpenses([]));
            dispatch(
              setAllDebt([
                {
                  id: nanoid(),
                  name: "Huslån",
                  amount: 2125000,
                  fee: 60,
                  interest: "4",
                  type: "serie",
                  termins: 300,
                },
              ])
            );
            router.push("/kalkulator");
          }}
        >
          <CardHeader title={t("guide:house.examples.apartment.title")} />
          <CardContent>
            <Typography>{t("guide:house.examples.common.time", { value: "25" })}</Typography>
            <Typography>
              {t("guide:house.examples.common.price", { value: "2 500 000" })}
            </Typography>
            <Typography>{t("guide:house.examples.common.equity", { value: "375 000" })}</Typography>
            <Typography>{t("guide:house.examples.common.type.serie")}</Typography>
            <Typography>{t("guide:house.examples.common.fee", { value: "60" })}</Typography>
            <Typography>{t("guide:house.examples.common.interest", { value: "4" })}</Typography>
          </CardContent>
          <CardActions className="justify-center">
            <Typography color="primary">Prøv i kalkulatoren</Typography>
          </CardActions>
        </AppClickableCardComponent>
        <AppClickableCardComponent
          href="/kalkulator"
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setAllIncomes([
                {
                  id: nanoid(),
                  name: "Jobb 1",
                  amount: 30000,
                },
                {
                  id: nanoid(),
                  name: "Jobb 2",
                  amount: 30000,
                },
              ])
            );
            dispatch(setAllExpenses([]));
            dispatch(
              setAllDebt([
                {
                  id: nanoid(),
                  name: "Huslån",
                  amount: 3400000,
                  fee: 60,
                  interest: "4",
                  type: "annuity",
                  termins: 300,
                },
              ])
            );
            router.push("/kalkulator");
          }}
        >
          <CardHeader title={t("guide:house.examples.house.title")} />
          <CardContent>
            <Typography>{t("guide:house.examples.common.time", { value: "25" })}</Typography>
            <Typography>
              {t("guide:house.examples.common.price", { value: "4 000 000" })}
            </Typography>
            <Typography>{t("guide:house.examples.common.equity", { value: "600 000" })}</Typography>
            <Typography>{t("guide:house.examples.common.type.annuity")}</Typography>
            <Typography>{t("guide:house.examples.common.fee", { value: "60" })}</Typography>
            <Typography>{t("guide:house.examples.common.interest", { value: "4" })}</Typography>
          </CardContent>
          <CardActions className="justify-center">
            <Typography color="primary">
              {t("guide:car.examples.common.toCalculatorButton.text")}
            </Typography>
          </CardActions>
        </AppClickableCardComponent>
        <AppClickableCardComponent
          href="/kalkulator"
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setAllIncomes([
                {
                  id: nanoid(),
                  name: "Jobb 1",
                  amount: 30000,
                },
                {
                  id: nanoid(),
                  name: "Jobb 2",
                  amount: 30000,
                },
              ])
            );
            dispatch(setAllExpenses([]));
            dispatch(
              setAllDebt([
                {
                  id: nanoid(),
                  name: "Huslån",
                  amount: 2300000,
                  fee: 60,
                  interest: "4",
                  type: "annuity",
                  termins: 300,
                },
                {
                  id: nanoid(),
                  name: "Fellesgjeld",
                  amount: 1100000,
                  fee: 60,
                  interest: "4",
                  type: "annuity",
                  termins: 300,
                },
              ])
            );
            router.push("/kalkulator");
          }}
        >
          <CardHeader title={t("guide:house.examples.housingAssociation.title")} />
          <CardContent>
            <Typography>{t("guide:house.examples.common.time", { value: "25" })}</Typography>
            <Typography>
              {t("guide:house.examples.common.price", { value: "2 900 000" })}
            </Typography>
            <Typography>
              {t("guide:house.examples.housingAssociation.sharedDebt", { value: "1 100 000" })}
            </Typography>
            <Typography>{t("guide:house.examples.common.equity", { value: "600 000" })}</Typography>
            <Typography>{t("guide:house.examples.common.type.annuity")}</Typography>
            <Typography>{t("guide:house.examples.common.fee", { value: "60" })}</Typography>
            <Typography>{t("guide:house.examples.common.interest", { value: "4" })}</Typography>
          </CardContent>
          <CardActions className="justify-center">
            <Typography color="primary">
              {t("guide:car.examples.common.toCalculatorButton.text")}
            </Typography>
          </CardActions>
        </AppClickableCardComponent>
      </div>
    </AppPageLayoutComponent >
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "guide"])),
    },
  };
}
