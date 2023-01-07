import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { selectDebtSeries } from "../store/selectors/graph-selector";
import { useAppSelector } from "../store/store";

export default function AppPaymentPlanComponent() {
  const { t } = useTranslation(["calculator"]);
  const { paymentPlan } = useAppSelector(selectDebtSeries);

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
        {paymentPlan
          .slice(1)
          .map(({ x, y, sumInterestPaidSoFar, sumPaidSoFar }, i) => {
            const payment = sumPaidSoFar - paymentPlan[i].sumPaidSoFar;
            const month = x as number;
            const interest =
              sumInterestPaidSoFar - paymentPlan[i].sumInterestPaidSoFar;
            const principal = payment - interest;

            return (
              <TableRow key={x as number}>
                <TableCell align="left">{month}</TableCell>
                <TableCell align="left">{Math.round(payment)}</TableCell>
                <TableCell align="left">{Math.round(principal)}</TableCell>
                <TableCell align="left">{Math.round(interest)}</TableCell>
                <TableCell align="left">{Math.round(sumPaidSoFar)}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
