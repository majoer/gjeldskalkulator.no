import Add from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/system";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addDebt, selectAllDebts } from "../store/debt-slice";
import { useAppSelector } from "../store/store";
import AppDebtComponent from "./app-debt-component";
import * as BigNumber from "bignumber.js";

export default function AppDebtsComponent() {
  const dispatch = useDispatch();
  const debts = useAppSelector(selectAllDebts);

  return (
    <Stack spacing={0} divider={<Divider />}>
      {debts.map((debt) => (
        <AppDebtComponent key={debt.id} debt={debt} />
      ))}
      <IconButton
        onClick={() => {
          dispatch(
            addDebt({
              id: nanoid(),
              fee: 60,
              amount: 100000,
              interest: BigNumber.BigNumber(10).toJSON(),
              name: `Creditor ${debts.length + 1}`,
            })
          );
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
