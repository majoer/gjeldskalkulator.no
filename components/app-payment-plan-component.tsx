import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { selectDebtSeries } from "../store/selectors/graph-selector";
import { useAppSelector } from "../store/store";

export default function AppPaymentPlanComponent() {
  const { paymentPlan } = useAppSelector(selectDebtSeries);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left">Month</TableCell>
          <TableCell align="left">Payment Amount</TableCell>
          <TableCell align="left">Principal Amount</TableCell>
          <TableCell align="left">Interest Amount</TableCell>
          <TableCell align="left">Paid so far</TableCell>
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
              <TableRow>
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
