import Favorite from "@mui/icons-material/Favorite";
import Info from "@mui/icons-material/Info";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ExpenseState } from "../store/expense-slice";
import {
  PLAN_BLOWS_TO_INFINITY,
  PLAN_TOO_LONG_TO_CALCULATE,
} from "../store/selectors/graph-selector";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppSelector } from "../store/store";
import { ExpenseOptionName } from "./app-expense-component";

export interface TipConditionArgs {
  incomeMap: any;
  expenseMap: Map<ExpenseOptionName, ExpenseState>;
  result: number;
  useTowardsDebt: number;
  totalCostOfDebt: number;
}
export interface TipCondition {
  color: string;
  active: boolean;
  targetId: string;
}

export interface ResolvedTip {
  summary: string;
  details: React.ReactNode;
  condition: TipCondition;
}

export interface UnresolvedTip {
  summary: string;
  condition: (args: TipConditionArgs) => TipCondition;
  details: React.ReactNode;
}

export const allTips: UnresolvedTip[] = [
  {
    summary: "Your income doesn't cover your expenses and debt",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p>
          It is not uncommon to spend more money then you can afford. <br />
          Hopefully we can help you balance your economy, so that your spending
          can match your income. <br />
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
        </ul>
      </div>
    ),
  },
  {
    summary: "You have many small loans with high interest",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You have no money left for savings",
    condition: ({ expenseMap, useTowardsDebt, result }) => ({
      color: "",
      active: !expenseMap.get("Savings") && useTowardsDebt >= result,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You have no money left for debt payments",
    condition: ({ result }) => ({
      color: "",
      active: result <= 0,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "Your debt is impossible to pay back.",
    condition: ({ totalCostOfDebt, useTowardsDebt }) => ({
      color: "",
      active: totalCostOfDebt === PLAN_BLOWS_TO_INFINITY && useTowardsDebt > 0,
      targetId: "",
    }),
    details: (
      <div>
        <p>You have to spend more towards debt. </p>
      </div>
    ),
  },
  {
    summary: "You will never finish while you live.",
    condition: ({ totalCostOfDebt }) => ({
      color: "",
      active: totalCostOfDebt === PLAN_TOO_LONG_TO_CALCULATE,
      targetId: "",
    }),
    details: (
      <div>
        <p>You have to spend more towards debt. </p>
      </div>
    ),
  },
  {
    summary: "You can't afford what you want to use for debt payments",
    condition: ({ useTowardsDebt, result }) => ({
      color: "text-red-400",
      active: useTowardsDebt !== 0 && useTowardsDebt > result,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You should spend more money on your debt",
    condition: ({ useTowardsDebt, result }) => ({
      color: "text-red-400",
      active: useTowardsDebt === 0 && result >= 0,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "Alimony is a big part of you expenses",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on transportation",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on vacations",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on your hobbies",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on alcohol",
    condition: ({}) => ({
      color: "",
      active: false,
      targetId: "",
    }),
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on food",
    condition: ({ expenseMap }) => ({
      color: "text-blue-500",
      active: expenseMap.get("Food")?.amount > 5000,
      targetId: expenseMap.get("Food")?.id,
    }),
    details: (
      <div>
        <a href="https://www.bunnpris.no/">https://www.bunnpris.no/</a>
      </div>
    ),
  },
  {
    summary: "You spend a lot on electricity",
    condition: ({ expenseMap }) => ({
      color: "text-yellow-500",
      active: expenseMap.get("Electricity")?.amount > 5000,
      targetId: expenseMap.get("Electricity")?.id,
    }),
    details: (
      <div>
        <a href="https://www.regjeringen.no/no/tema/energi/regjeringens-stromtiltak/id2900232/">
          https://www.regjeringen.no/no/tema/energi/regjeringens-stromtiltak/id2900232/
        </a>
      </div>
    ),
  },
  {
    summary: "You haven't classified your expenses",
    condition: ({ expenseMap }) => ({
      color: "text-orange-500",
      active: !!expenseMap["Other"],
      targetId: expenseMap["Other"]?.id,
    }),
    details: (
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
  },
];

export default function AppTipsComponent() {
  const { allRelevantTips } = useAppSelector(selectTips);

  return (
    <div>
      {allRelevantTips.map(({ summary, details, condition }, i) => (
        <Accordion key={i}>
          <AccordionSummary>
            <div className="mr-8 relative">
              <Info
                className={`absolute left-0 top-1/2 -translate-y-1/2 ${condition.color}`}
              />
            </div>
            <div>{summary}</div>
          </AccordionSummary>
          <AccordionDetails>{details}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
