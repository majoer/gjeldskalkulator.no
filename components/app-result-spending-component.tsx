import { debounce } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import {
  ResultSpendingState,
  selectResultSpending,
  updateResultSpending,
} from "../store/result-spending-slice";
import {
  selectResult,
  selectUseTowardsDebt,
} from "../store/selectors/result-selector";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function AppResultSpendingComponent() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectResult);
  const resultSpendingValue = useAppSelector(selectUseTowardsDebt);
  const resultSpending = useAppSelector(selectResultSpending);
  const [useTowardsDebt, setUseTowardsDebt] = useState(
    resultSpending.useTowardsDebt
  );
  const [useTowardsDebtType, setUseTowardsDebtType] = useState(
    resultSpending.useTowardsDebtType
  );

  const debouncedUpdate = useCallback(
    debounce((changes: Partial<ResultSpendingState>) => {
      dispatch(updateResultSpending(changes));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ useTowardsDebt, useTowardsDebtType });
  }, [useTowardsDebt, useTowardsDebtType]);

  return (
    <div>
      <TextField
        id="useTowardsDebt"
        className="m-2"
        label="Use for Debt payments"
        variant="standard"
        value={useTowardsDebt}
        onChange={(e) => setUseTowardsDebt(parseInt(e.target.value, 10))}
      />
      <FormControl variant="standard" className="m-2">
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          value={useTowardsDebtType}
          label="Type"
          variant="standard"
          onChange={(e) =>
            setUseTowardsDebtType(e.target.value as "percentage" | "number")
          }
        >
          <MenuItem value={"percentage"}>%</MenuItem>
          <MenuItem value={"number"}>,-</MenuItem>
        </Select>
      </FormControl>

      {useTowardsDebtType === "percentage" ? (
        <TextField
          id="result"
          disabled
          className="m-2"
          label={`${useTowardsDebt}% of ${result} =`}
          variant="standard"
          value={Math.round(resultSpendingValue)}
        />
      ) : null}
    </div>
  );
}
