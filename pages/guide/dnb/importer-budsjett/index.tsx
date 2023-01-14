import Info from "@mui/icons-material/Info";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import Papa from "papaparse";
import { useState } from "react";
import { ExpenseOptionNames } from "../../../../components/app-expense-component";
import AppGuideCardComponent from "../../../../components/guide/app-guide-card-component";
import { ExpenseState, setAllExpenses } from "../../../../store/expense-slice";
import { IncomeState, setAllIncomes } from "../../../../store/income-slice";
import { useAppDispatch } from "../../../../store/store";
import { steps } from "../../index";

export default function AppGuideDnbImportBudgetPage() {
  const { t } = useTranslation(["guide", "calculator"]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <AppGuideCardComponent steps={steps} currentStep={2}>
      <>
        <CardContent>
          <Link
            className="flex flex-row flex-nowrap justify-center"
            href="https://github.com/majoer/gjeldskalkulator.no"
            title={t("guide:dnb.uploadBudget.githubLink.title")}
          >
            <div>
              <Info color="warning" className="h-full mr-3" />
            </div>
            <div className="text-left">
              <Typography variant="caption">
                {t("guide:dnb.uploadBudget.disclaimer1")}
              </Typography>
              <br />
              <Typography variant="caption">
                {t("guide:dnb.uploadBudget.disclaimer2")}
              </Typography>
            </div>
          </Link>
        </CardContent>

        <CardActions className="justify-between">
          <Button
            variant="contained"
            color="secondary"
            LinkComponent={Link}
            href="/guide/dnb/hent-budsjett"
          >
             {t("guide:backButton.text")}
          </Button>
          <Button variant="contained" component="label" className="relative">
            <span className={` ${loading ? "invisible" : "visible"}`}>
              {t("guide:dnb.uploadBudget.button.text")}
            </span>

            {loading ? (
              <CircularProgress
                color="inherit"
                size={20}
                className="absolute"
              />
            ) : null}
            <input
              hidden
              accept=".txt"
              multiple
              type="file"
              onChange={async (event) => {
                setLoading(true);
                try {
                  const file = event.target.files.item(0);
                  const text = await file.text();
                  const { data } = Papa.parse(text, {
                    delimiter: "\t",
                  });

                  const norwegianKeys = ExpenseOptionNames.map((key) => ({
                    key,
                    nb: t(`calculator:expense.options.${key}`, {
                      lng: "nb-NO",
                    }).toLowerCase(),
                  }));
                  console.log(norwegianKeys);
                  const budget = data.slice(1).reduce((map, line) => {
                    if (!map[line[0]]) {
                      map[line[0]] = {};
                    }
                    const post = norwegianKeys.find(
                      ({ nb }) => line[1] && line[1].toLowerCase().includes(nb)
                    );

                    if (!post) {
                      console.error("unknown post", line[1]);
                    }

                    if (!map[line[0]][post?.key || "other"]) {
                      map[line[0]][post?.key || "other"] = 0;
                    }

                    map[line[0]][post?.key || "other"] += Math.abs(
                      parseInt(line[4], 10)
                    );

                    return map;
                  }, {});

                  const incomes: IncomeState[] = Object.keys(
                    budget.Inntekter
                  ).map((post) => ({
                    id: nanoid(),
                    name: post,
                    amount: budget.Inntekter[post],
                  }));

                  const expenses: ExpenseState[] = Object.keys(
                    budget.Utgifter
                  ).map((post) => ({
                    id: nanoid(),
                    name: post,
                    amount: budget.Utgifter[post],
                  }));

                  dispatch(setAllIncomes(incomes));
                  dispatch(setAllExpenses(expenses));
                } finally {
                  router.push("/kalkulator");
                }
              }}
            />
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
