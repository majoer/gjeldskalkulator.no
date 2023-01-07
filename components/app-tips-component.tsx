import ExpandMore from "@mui/icons-material/ExpandMore";
import Favorite from "@mui/icons-material/Favorite";
import Info from "@mui/icons-material/Info";
import Accordion from "@mui/material/Accordion";
import AccordionDetailsComponent from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import * as BigNumber from "bignumber.js";
import React from "react";
import {
  selectOpenTips,
  setOpenTips,
  updateNavigation,
} from "../store/debt-insight-slice";
import { ExpenseState } from "../store/expense-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppDispatch, useAppSelector } from "../store/store";
import AppExpandingPaperComponent from "./app-expanding-paper-component";
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

const expenseLimits: {
  [Property in ExpenseOptionName]: { limit: number; component: React.FC };
} = {
  rent: { limit: 10000, component: () => <div></div> },
  electricity: { limit: 5000, component: () => <div></div> },
  transportation: { limit: 5000, component: () => <div></div> },
  food: { limit: 10000, component: () => <div></div> },
  clothes: { limit: 3000, component: () => <div></div> },
  internet: { limit: 1500, component: () => <div></div> },
  phone: { limit: 1000, component: () => <div></div> },
  streaming: { limit: 2000, component: () => <div></div> },
  household: { limit: 3000, component: () => <div></div> },
  hobby: { limit: 2000, component: () => <div></div> },
  savings: { limit: -1, component: () => <div></div> },
  vacation: { limit: 2000, component: () => <div></div> },
  medicine: { limit: -1, component: () => <div></div> },
  alcohol: { limit: 0, component: () => <div></div> },
  childSupport: { limit: 10000, component: () => <div></div> },
  children: { limit: 3000, component: () => <div></div> },
  other: { limit: 5000, component: () => <div></div> },
};

export const allTips: UnresolvedTip[] = [
  ({ expenseMap, incomeMap, result, totalCostOfDebt, useTowardsDebt }) => {
    const expensesOverLimit = ExpenseOptionNames.filter(
      (post) =>
        expenseLimits[post].limit !== -1 &&
        expenseMap.get(post)?.amount > expenseLimits[post].limit
    );

    return {
      summary: "Reduce spending",
      active: expensesOverLimit.length > 0,
      color: "text-blue-500",
      targetId: expensesOverLimit.map((post) => expenseMap.get(post).id),
      DetailsComponent: () => {
        const dispatch = useAppDispatch();
        const openTips = useAppSelector(selectOpenTips);

        return (
          <div>
            <div className="flex flex-wrap">
              {expensesOverLimit.map((post) => {
                const Component = expenseLimits[post].component;
                return (
                  <AppExpandingPaperComponent
                    key={post}
                    title={post}
                    open={openTips[`Reduce spending-${post}`] || false}
                    onChange={({ open }) =>
                      dispatch(
                        setOpenTips({
                          [`Reduce spending`]: true,
                          [`Reduce spending-${post}`]: open,
                        })
                      )
                    }
                  >
                    <Component />
                  </AppExpandingPaperComponent>
                );
              })}
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
      !expenseMap.get("savings") &&
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
  const dispatch = useAppDispatch();
  const { allRelevantTips } = useAppSelector(selectTips);
  const openTips = useAppSelector(selectOpenTips);

  return (
    <div>
      {allRelevantTips.map(
        ({ summary, DetailsComponent, active, color }, i) => (
          <Accordion
            key={i}
            expanded={openTips[summary] || false}
            onChange={(_, isExpanded) =>
              dispatch(
                updateNavigation({
                  openTips: {
                    ...openTips,
                    [summary]: isExpanded,
                  },
                })
              )
            }
          >
            <AccordionSummary
              className="flex-row-reverse"
              expandIcon={<ExpandMore />}
            >
              <div className="ml-3 relative flex justify-between w-full">
                <div>{summary}</div>
                <div className="ml-3 relative">
                  <Info
                    className={`absolute right-1 top-1/2 -translate-y-1/2 ${color}`}
                  />
                </div>
              </div>
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
