import Info from "@mui/icons-material/Info";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Papa from "papaparse";
import { ExpenseOptionNames } from "../../../../components/app-expense-component";
import AppGuideCardComponent from "../../../../components/guide/app-guide-card-component";
import AppLoadingButton from "../../../../components/io/app-loading-button-component";
import { ExpenseState, setAllExpenses } from "../../../../store/expense-slice";
import { IncomeState, setAllIncomes } from "../../../../store/income-slice";
import { useAppDispatch } from "../../../../store/store";
import { steps } from "../../index";

export default function AppGuideDnbImportBudgetPage() {
  const { t } = useTranslation(["guide", "calculator"]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <AppGuideCardComponent steps={steps} currentStep={2}>
      <Head>
        <title>Importer et budsjett fra din bank</title>
        <meta
          name="description"
          content="Importer et budsjett fra din bank inn til kalkulatoren."
        />
      </Head>
      <>
        <CardContent>
          <div className="flex flex-row flex-nowrap justify-center">
            <div>
              <Info color="info" className="h-full mr-3" />
            </div>
            <div className="text-left">
              <Typography variant="caption">{t("guide:dnb.uploadBudget.disclaimer1")}</Typography>
              <br />
              <Typography variant="caption">{t("guide:dnb.uploadBudget.disclaimer2")}</Typography>
            </div>
          </div>
        </CardContent>

        <CardActions className="justify-between">
          <AppLoadingButton
            variant="contained"
            color="secondary"
            LinkComponent={Link}
            href="/guide/dnb/hent-budsjett"
          >
            {t("guide:backButton.text")}
          </AppLoadingButton>

          <AppLoadingButton
            variant="contained"
            color="warning"
            LinkComponent={Link}
            href="/kalkulator"
          >
            {t("guide:skipButton.text")}
          </AppLoadingButton>

          <AppLoadingButton variant="contained" component="label" className="relative">
            {({ setLoading }) => (
              <div>
                {t("guide:dnb.uploadBudget.importButton.text")}
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

                      const budget = data.slice(1).reduce((map, line) => {
                        const category: "Inntekter" | "Utgifter" = line[0];

                        if (!map[category]) {
                          map[category] = {};
                        }

                        const budgetPost =
                          category === "Inntekter"
                            ? line[1]
                            : norwegianKeys.find(
                                ({ nb }) => line[1] && line[1].toLowerCase().includes(nb)
                              )?.key || "other";

                        if (!map[line[0]][budgetPost]) {
                          map[line[0]][budgetPost] = 0;
                        }

                        map[line[0]][budgetPost] += Math.round(
                          Math.abs(parseInt(line[4], 10) / 12)
                        );

                        return map;
                      }, {});

                      const incomes: IncomeState[] = Object.keys(budget.Inntekter).map((post) => ({
                        id: nanoid(),
                        name: post,
                        amount: budget.Inntekter[post],
                      }));

                      const expenses: ExpenseState[] = Object.keys(budget.Utgifter).map((post) => ({
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
              </div>
            )}
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
