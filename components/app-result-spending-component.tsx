import { debounce } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { nonNegativeInteger, percentage } from "../validation/validation";

export default function AppResultSpendingComponent() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectResult);
  const resultSpendingValue = useAppSelector(selectUseTowardsDebt);
  const resultSpending = useAppSelector(selectResultSpending);
  const [useTowardsDebt, setUseTowardsDebt] = useState(
    resultSpending.useTowardsDebt.toString()
  );
  const [useTowardsDebtType, setUseTowardsDebtType] = useState(
    resultSpending.useTowardsDebtType
  );

  const errors = useMemo(
    () => ({
      useTowardsDebt:
        useTowardsDebtType === "number"
          ? nonNegativeInteger(useTowardsDebt)
          : percentage(useTowardsDebt),
      useTowardsDebtType: undefined,
    }),
    [useTowardsDebt, useTowardsDebtType]
  );

  const debouncedUpdate = useCallback(
    debounce(({ useTowardsDebt, useTowardsDebtType, errors }) => {
      const fullUpdate: Partial<ResultSpendingState> = {
        useTowardsDebtType,
        useTowardsDebt,
      };

      const changes: Partial<ResultSpendingState> = Object.keys(errors)
        .filter((field) => !errors[field])
        .reduce((update, field) => {
          update[field] = fullUpdate[field];
          return update;
        }, {});

      dispatch(updateResultSpending(changes));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ useTowardsDebt, useTowardsDebtType, errors });
  }, [useTowardsDebt, useTowardsDebtType, errors]);

  return (
    <div>
      <TextField
        id="useTowardsDebt"
        className="m-2"
        label="Use for Debt payments"
        variant="standard"
        value={useTowardsDebt}
        error={!!errors["useTowardsDebt"]}
        helperText={errors["useTowardsDebt"]}
        onChange={(e) => setUseTowardsDebt(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" className="absolute right-0">
              <div>{useTowardsDebtType === "number" ? "kr" : "%"}</div>
            </InputAdornment>
          ),
        }}
      />
      <FormControl variant="standard" className="m-2">
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          value={useTowardsDebtType}
          label="Type"
          variant="standard"
          onChange={(e) => {
            setUseTowardsDebtType(e.target.value as "percentage" | "number");

            if (e.target.value === "number") {
              setUseTowardsDebt(
                resultSpendingValue.decimalPlaces(0).toString()
              );
            } else {
              setUseTowardsDebt(
                "" +
                  resultSpendingValue
                    .dividedBy(result)
                    .multipliedBy(100)
                    .decimalPlaces(0)
                    .toNumber()
              );
            }
          }}
        >
          <MenuItem value={"percentage"}>Percent</MenuItem>
          <MenuItem value={"number"}>NOK</MenuItem>
        </Select>
      </FormControl>

      {useTowardsDebtType === "percentage" ? (
        <TextField
          id="result"
          disabled
          className="m-2"
          label={`${useTowardsDebt}% of ${result} =`}
          variant="standard"
          value={"" + resultSpendingValue.decimalPlaces(0).toNumber()}
        />
      ) : null}
    </div>
  );
}
