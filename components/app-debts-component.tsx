import Add from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/system/Stack";
import { nanoid } from "@reduxjs/toolkit";
import * as BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { addDebt, selectAllDebts } from "../store/debt-slice";
import { useAppSelector } from "../store/store";
import AppDebtComponent from "./app-debt-component";

export default function AppDebtsComponent() {
  const { t } = useTranslation(["calculator"]);
  const dispatch = useDispatch();
  const debts = useAppSelector(selectAllDebts);

  return (
    <Stack spacing={0} divider={<Divider />}>
      {debts.map((debt) => (
        <AppDebtComponent key={debt.id} debt={debt} />
      ))}
      <IconButton
        color="primary"
        title={t("calculator:debts.add.title")}
        onClick={() => {
          dispatch(
            addDebt({
              id: nanoid(),
              fee: 60,
              amount: 100000,
              interest: BigNumber.BigNumber(10).toJSON(),
              type: "credit",
              name: t("calculator:debts.defaultNewDebt.name", {
                value: debts.length + 1,
              }),
            })
          );
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
