import Favorite from "@mui/icons-material/Favorite";
import Info from "@mui/icons-material/Info";
import Accordion from "@mui/material/Accordion";
import AccordionDetailsComponent from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as BigNumber from "bignumber.js";
import { useState } from "react";
import { ExpenseState } from "../store/expense-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppSelector } from "../store/store";
import { ExpenseOptionName, ExpenseOptionNames } from "./app-expense-component";

export interface TipConditionArgs {
  incomeMap: any;
  expenseMap: Map<ExpenseOptionName, ExpenseState>;
  result: number;
  useTowardsDebt: BigNumber.BigNumber;
  totalCostOfDebt: number;
}
export interface TipCondition {}

export interface ResolvedTip {
  summary: string;
  active: boolean;
  targetId: string[];
  color: string;
  DetailsComponent: React.FC;
}

export type UnresolvedTip = (args: TipConditionArgs) => ResolvedTip;

const expenseLimits: { [Property in ExpenseOptionName]: number } = {
  Rent: 10000,
  Electricity: 5000,
  Transportation: 5000,
  Food: 10000,
  Clothes: 3000,
  Internet: 1500,
  Phone: 1000,
  Streaming: 2000,
  Household: 1000,
  Hobby: 2000,
  Savings: -1,
  Vacation: 2000,
  Medicine: -1,
  Living: 3000,
  Alcohol: 0,
  "Child Support": 10000,
  Children: 3000,
  Other: 5000,
};

export const allTips: UnresolvedTip[] = [
  ({ expenseMap, incomeMap, result, totalCostOfDebt, useTowardsDebt }) => {
    const expensesOverLimit = ExpenseOptionNames.filter(
      (post) =>
        expenseLimits[post] !== -1 &&
        expenseMap.get(post)?.amount > expenseLimits[post]
    );

    return {
      summary: "Reduce spending",
      active: expensesOverLimit.length > 0,
      color: "",
      targetId: expensesOverLimit.map((post) => expenseMap.get(post).id),
      DetailsComponent: () => {
        const [focused, setFocused] = useState(null);
        return (
          <div>
            <div className="flex flex-wrap">
              {expensesOverLimit
                .filter((e) => !focused || e === focused)
                .map((post) => (
                  <Paper
                    elevation={5}
                    key={post}
                    className={`relative m-2 p-3 h-15 ${
                      focused === post
                        ? "w-full h-96"
                        : focused === null
                        ? "w-1/4"
                        : ""
                    }`}
                  >
                    {focused ? (
                      <Button
                        className="absolute top-0 right-0"
                        onClick={() => setFocused(null)}
                      >
                        x
                      </Button>
                    ) : null}

                    <Typography
                      align="center"
                      variant="h6"
                      onClick={() => {
                        setFocused(post);
                      }}
                    >
                      {post}
                    </Typography>

                    {focused ? (
                      <Typography>
                        Regjeringen har innført en rekke midlertidige
                        støtteordninger som hjelp til å håndtere de rekordhøye
                        strømprisene. Her får du en oversikt over alle
                        støtteordningene og hvor mye som er bevilget.
                      </Typography>
                    ) : null}
                  </Paper>
                ))}
            </div>
            {/* <p>
            It is not uncommon to spend more money then you can afford. <br />
            Hopefully we can help you balance your economy, so that your
            spending can match your income. <br />
            Here are some general suggestions:
          </p>
          <ul>
            <li>
              Reduce your expenses or debt payments. There should be other tips
              here to help you.
            </li>
            <li>
              Increase your income by getting a second job -{" "}
              <a href="https://www.nav.no/">https://www.nav.no/</a>
            </li>
          </ul> */}
          </div>
        );
      },
    };
  },
  ({ expenseMap }) => ({
    summary: "Refinance your debt",
    active: false,
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p></p>
      </div>
    ),
  }),
  ({ expenseMap, useTowardsDebt, result }) => ({
    summary: "Set some money aside for savings",
    active:
      !expenseMap.get("Savings") &&
      useTowardsDebt.isGreaterThanOrEqualTo(result),
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p></p>
      </div>
    ),
  }),
  ({ expenseMap }) => ({
    summary: "Use more of your profits on debt",
    active: false,
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p></p>
      </div>
    ),
  }),
  ({ expenseMap }) => ({
    summary: "Apply for public debt annullment",
    active: false,
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p>You have to spend more towards debt. </p>
      </div>
    ),
  }),
  ({ expenseMap }) => ({
    summary: "Prioritize high interest debt first",
    active: false,
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p>You have to spend more towards debt. </p>
      </div>
    ),
  }),
  ({ expenseMap }) => ({
    summary: "Take up a second job",
    active: false,
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p></p>
      </div>
    ),
  }),
  ({ expenseMap }) => ({
    summary: "Talk with NAV",
    active: false,
    color: "",
    targetId: [],
    DetailsComponent: () => (
      <div>
        <p></p>
      </div>
    ),
  }),
  ({ expenseMap }) => ({
    summary: "You haven't classified your expenses",
    active: !!expenseMap["Other"],
    color: "text-orange-500",
    targetId: expenseMap["Other"]?.id,
    DetailsComponent: () => (
      <div>
        <p>
          This app can't give any meaningful advice without insight into your
          expenses. Try to be as specific as possible when filling out your
          expenses.
        </p>

        <p>
          Don't worry, we don't store any of your data on our end. You are 100%
          anonymous here. <Favorite className="text-red-500" color="inherit" />
        </p>
      </div>
    ),
  }),
];

export default function AppTipsComponent() {
  const { allRelevantTips } = useAppSelector(selectTips);

  return (
    <div>
      {allRelevantTips.map(
        ({ summary, DetailsComponent, active, color }, i) => (
          <Accordion key={i}>
            <AccordionSummary>
              <div className="mr-8 relative">
                <Info
                  className={`absolute left-0 top-1/2 -translate-y-1/2 ${color}`}
                />
              </div>
              <div>{summary}</div>
            </AccordionSummary>
            <AccordionDetailsComponent>
              <DetailsComponent />
            </AccordionDetailsComponent>
          </Accordion>
        )
      )}
    </div>
  );
}
