import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations.js";
import { useRouter } from "next/router.js";
import AppClickableCardComponent from "../../components/io/app-clickable-card-component";
import { setAllDebt } from "../../store/debt-slice";
import { setAllIncomes } from "../../store/income-slice";
import { useAppDispatch } from "../../store/store";

export default function AppBoliglaanPage() {
  const { t } = useTranslation(["guide"]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="text-center m-auto">
      <Typography variant="h1" className="py-10">
        {t("guide:car.title")}
      </Typography>
      <Typography>{t("guide:car.description")}</Typography>
      <br />

      <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 gap-10 md:w-4/6 xl:w-3/6 m-auto">
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
              ])
            );
            dispatch(
              setAllDebt([
                {
                  id: nanoid(),
                  name: "billån",
                  amount: 500000,
                  fee: 50,
                  interest: "4",
                  type: "annuity",
                  termins: 120,
                },
              ])
            );
            router.push("/kalkulator");
          }}
        >
          <CardHeader title={t("guide:car.examples.newCar.title")} />
          <CardContent>
            <Typography>{t("guide:car.examples.common.time", { value: "10" })}</Typography>
            <Typography>{t("guide:car.examples.common.price", { value: "500 000" })}</Typography>
            <Typography>{t("guide:car.examples.common.equity", { value: "0" })}</Typography>
            <Typography>{t("guide:car.examples.common.interest", { value: "4" })}</Typography>
            <Typography>{t("guide:car.examples.common.fee", { value: "50" })}</Typography>
          </CardContent>
          <CardActions className="justify-center">
            <Button>{t("guide:car.examples.common.toCalculatorButton.text")}</Button>
          </CardActions>
        </AppClickableCardComponent>
        <AppClickableCardComponent
          href="/kalkulator"
          onClick={(e) => {
            console.log("kasjhd");
            e.preventDefault();
            dispatch(
              setAllIncomes([
                {
                  id: nanoid(),
                  name: "Jobb 1",
                  amount: 30000,
                },
              ])
            );
            dispatch(
              setAllDebt([
                {
                  id: nanoid(),
                  name: "billån",
                  amount: 100000,
                  fee: 50,
                  interest: "4",
                  type: "annuity",
                  termins: 36,
                },
              ])
            );
            router.push("/kalkulator");
          }}
        >
          <CardHeader title={t("guide:car.examples.usedCar.title")} />
          <CardContent>
            <Typography>{t("guide:car.examples.common.time", { value: "5" })}</Typography>
            <Typography>{t("guide:car.examples.common.price", { value: "100 000" })}</Typography>
            <Typography>{t("guide:car.examples.common.equity", { value: "0" })}</Typography>
            <Typography>{t("guide:car.examples.common.interest", { value: "4" })}</Typography>
            <Typography>{t("guide:car.examples.common.fee", { value: "50" })}</Typography>
          </CardContent>
          <CardActions className="justify-center">
            <Button>{t("guide:car.examples.common.toCalculatorButton.text")}</Button>
          </CardActions>
        </AppClickableCardComponent>
      </div>
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
