import Favorite from "@mui/icons-material/Favorite";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ExpenseState } from "../store/expense-slice";
import { IncomeState } from "../store/income-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppSelector } from "../store/store";

export interface TipConditionArgs {
  incomeMap: { [key: string]: IncomeState };
  expenseMap: { [key: string]: ExpenseState };
}

export interface Tip {
  summary: String;
  condition: (args: TipConditionArgs) => boolean;
  details: React.ReactNode;
}

export const allTips: Tip[] = [
  {
    summary: "Your income doesn't cover your expenses and debt",
    condition: () => true,
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
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You have many small loans with high interest",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You have no money left for savings",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "Alimony is a big part of you expenses",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on transportation",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on vacations",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on your hobbies",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on alcohol",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on food",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You spend a lot on electricity",
    condition: () => true,
    details: (
      <div>
        <p></p>
      </div>
    ),
  },
  {
    summary: "You haven't classified your expenses",
    condition: ({ expenseMap }) => {
      return Object.keys(expenseMap).length === 0 || !!expenseMap["Other"];
    },
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
  const tips = useAppSelector(selectTips);

  return (
    <div>
      {tips.map(({ summary, details }, i) => (
        <Accordion key={i}>
          <AccordionSummary>{summary}</AccordionSummary>
          <AccordionDetails>{details}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
