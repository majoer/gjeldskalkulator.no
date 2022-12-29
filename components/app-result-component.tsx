import TextField from "@mui/material/TextField"
import { selectResult } from "../store/selectors/result-selector"
import { useAppSelector } from "../store/store"

export default function AppResultComponent() {
  const result = useAppSelector(selectResult);
  const resultTowardsDebt = result > 0 ? result : 0;

  return (
    <div>
      <TextField
        id="result"
        className="m-2 shrink-0 grow-0"
        label="Use for Debt payments"
        variant="standard"
        value={resultTowardsDebt}
      />
    </div>
  );
}
