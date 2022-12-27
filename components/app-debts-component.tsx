import Add from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/system";
import { useReducer, useState } from "react";
import AppDebtComponent, { Loan } from "./app-debt-component";
import Divider from "@mui/material/Divider";

interface AppAction {
  type: string;
  payload?: any;
}

interface AppState {
  loans: Loan[];
}

function reducer(state: AppState, action: AppAction): AppState {
  if (action.type === "addLoan") {
    return {
      ...state,
      loans: [...state.loans, { name: "Lån", amount: 0, interest: 5 }],
    };
  }

  if (action.type === "removeLoan") {
    return {
      ...state,
      // loans: state.loans.slice(0)
    };
  }

  throw Error("Unknown action.");
}

const initialState: AppState = {
  loans: [
    { name: "kredit 1", amount: 100000, interest: 20 },
    { name: "kredit 2", amount: 200000, interest: 10 },
  ],
};

export default function AppDebtsComponent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loans } = state;

  return (
    <Stack spacing={0} divider={<Divider />}>
      {loans.map((loan, i) => (
        <AppDebtComponent key={i} loan={loan} />
      ))}
      <IconButton
        onClick={() => {
          dispatch({ type: "addLoan" });
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
