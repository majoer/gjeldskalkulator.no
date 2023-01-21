import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "next-i18next";
import { DebtHistory } from "../../store/selectors/graph-selector";

const LOAD_NUMBER_OF_ROWS = 40;

export interface AppPaymentPlanTableProps {
  debtHistory: DebtHistory[];
}

export default function AppPaymentPlanTableComponent({ debtHistory }: AppPaymentPlanTableProps) {
  const { t } = useTranslation(["calculator"]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="left">{t("calculator:paymentPlan.tableHeader.month")}</TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.paymentAmount")}
          </TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.principalAmount")}
          </TableCell>
          <TableCell align="left">
            {t("calculator:paymentPlan.tableHeader.interestAmount")}
          </TableCell>
          <TableCell align="left">{t("calculator:paymentPlan.tableHeader.paidSoFar")}</TableCell>
          <TableCell align="left">{t("calculator:paymentPlan.tableHeader.remaining")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {debtHistory.map(
          (
            {
              month,
              paidSoFar,
              interestPaidSoFar,
              remaining,
              terminResult: { terminAmount, interestAmount, principalAmount },
            },
            i
          ) => {
            return (
              <TableRow key={i}>
                <TableCell align="left">{month}</TableCell>
                <TableCell align="left">{terminAmount.integerValue().toNumber()}</TableCell>
                <TableCell align="left">{principalAmount.integerValue().toNumber()}</TableCell>
                <TableCell align="left">{interestAmount.integerValue().toNumber()}</TableCell>
                <TableCell align="left">{paidSoFar.integerValue().toNumber()}</TableCell>
                <TableCell align="left">{remaining.integerValue().toNumber()}</TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
}
