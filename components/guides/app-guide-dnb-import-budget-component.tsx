import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router.js";
import Papa from "papaparse";
import { ExpenseOptionNames } from "../../components/app-expense-component";
import { ExpenseState, setAllExpenses } from "../../store/expense-slice";
import { IncomeState, setAllIncomes } from "../../store/income-slice";
import { useAppDispatch } from "../../store/store";

export default function AppGuideDnbImportBudgetComponent() {
  const { t } = useTranslation(["guide", "calculator"]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <>
      <CardContent>
        <Typography>
          {t("guide:dnb.uploadBudget.upload")}
          <br />
          {t("guide:dnb.uploadBudget.disclaimer")}
        </Typography>
      </CardContent>

      <CardActions className="justify-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("#dnb-hent-budsjett")}
        >
           {t("guide:backButton.text")}
        </Button>
        <Button variant="contained" component="label">
          {t("guide:dnb.uploadBudget.button.text")}
          <input
            hidden
            accept=".txt"
            multiple
            type="file"
            onChange={async (event) => {
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

              const incomes: IncomeState[] = Object.keys(budget.Inntekter).map(
                (post) => ({
                  id: nanoid(),
                  name: post,
                  amount: budget.Inntekter[post],
                })
              );

              const expenses: ExpenseState[] = Object.keys(budget.Utgifter).map(
                (post) => ({
                  id: nanoid(),
                  name: post,
                  amount: budget.Utgifter[post],
                })
              );

              dispatch(setAllIncomes(incomes));
              dispatch(setAllExpenses(expenses));
              router.push("/kalkulator");
            }}
          />
        </Button>
      </CardActions>
    </>
  );
}
