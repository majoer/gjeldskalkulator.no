import { debounce } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { selectDebtSeries } from "../store/selectors/graph-selector";
import { useAppSelector } from "../store/store";
import { TAB_PLAN } from "./app-debt-insight";

const LOAD_NUMBER_OF_ROWS = 40;

export default function AppPaymentPlanComponent() {
  const { t } = useTranslation(["calculator"]);
  const { paymentPlan } = useAppSelector(selectDebtSeries);
  const [index, setIndex] = useState(LOAD_NUMBER_OF_ROWS + 1);

  const partialPaymentPlan = useMemo(() => {
    const plan = paymentPlan.slice(1, index);
    return plan;
  }, [paymentPlan, index]);

  useEffect(() => setIndex(LOAD_NUMBER_OF_ROWS + 1), [paymentPlan]);

  const fetchMoreData = useCallback(
    debounce(() => {
      const newIndex = Math.min(
        index + LOAD_NUMBER_OF_ROWS,
        paymentPlan.length
      );

      setIndex(newIndex);
    }, 50),
    [paymentPlan, index]
  );

  const onScroll = useCallback(() => {
    const el = document.getElementById(`simple-tabpanel-${TAB_PLAN}`);
    const canLoadMore = index <= paymentPlan.length - 1;
    const shouldLoadMore = el.scrollTop >= el.scrollHeight - 1000;

    console.log(
      el.scrollTop,
      el.scrollHeight - 1500,
      canLoadMore,
      shouldLoadMore,
      index,
      paymentPlan.length
    );

    if (canLoadMore && shouldLoadMore) {
      fetchMoreData();
    }
  }, [paymentPlan, index]);

  useEffect(() => {
    const el = document.getElementById(`simple-tabpanel-${TAB_PLAN}`);
    el.addEventListener("scroll", onScroll);

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [paymentPlan, index]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.month")}
          </TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.paymentAmount")}
          </TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.principalAmount")}
          </TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.interestAmount")}
          </TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.paidSoFar")}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {partialPaymentPlan.map(
          ({ x, y, sumInterestPaidSoFar, sumPaidSoFar }, i) => {
            const payment = sumPaidSoFar - paymentPlan[i].sumPaidSoFar;
            const month = x as number;
            const interest =
              sumInterestPaidSoFar - paymentPlan[i].sumInterestPaidSoFar;
            const principal = payment - interest;

            return (
              <TableRow key={i}>
                <TableCell align="left">{month}</TableCell>
                <TableCell align="left">{Math.round(payment)}</TableCell>
                <TableCell align="left">{Math.round(principal)}</TableCell>
                <TableCell align="left">{Math.round(interest)}</TableCell>
                <TableCell align="left">{Math.round(sumPaidSoFar)}</TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
}
