import AppDebtInsightComponent from "../../components/app-debt-insight";
import AppUserInputComponent from "../../components/app-user-input-component";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full xl:w-1/2 xl:min-h-screen mb-4 xl:mb-0 bg-slate-100 xl:p-1 rounded">
        <AppUserInputComponent />
      </div>
      <div className="w-full xl:w-1/2 static h-96 xl:h-screen xl:fixed xl:top-0 xl:bottom-0 xl:right-0">
        <AppDebtInsightComponent />
      </div>
    </div>
  );
}
