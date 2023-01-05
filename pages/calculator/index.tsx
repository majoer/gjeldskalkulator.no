import Paper from "@mui/material/Paper";
import AppDebtInsightComponent from "../../components/app-debt-insight";
import AppUserInputComponent from "../../components/app-user-input-component";

export default function CalculatorPage() {
  return (
    <Paper className="min-h-screen h-100%">
      <div className="w-full xl:w-1/2 mb-4 pt-16 xl:mb-0 bg-slate-100">
        <AppUserInputComponent />
      </div>
      <div className="w-full xl:w-1/2 static top-16 xl:fixed xl:bottom-0 xl:right-0">
        <AppDebtInsightComponent />
      </div>
    </Paper>
  );
}
