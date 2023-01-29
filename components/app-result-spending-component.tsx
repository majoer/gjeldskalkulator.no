import { debounce } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResultSpendingState,
  selectResultSpending,
  updateResultSpending,
} from "../store/result-spending-slice";
import { selectResult, selectUseTowardsDebt } from "../store/selectors/result-selector";
import { useAppDispatch, useAppSelector } from "../store/store";
import { naturalNumber, percentage } from "../validation/validation";
import AppTextFieldComponent from "./io/app-text-field-component";

export default function AppResultSpendingComponent() {
  const { t } = useTranslation(["calculator"]);
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectResult);
  const resultSpendingValue = useAppSelector(selectUseTowardsDebt);
  const resultSpending = useAppSelector(selectResultSpending);
  const [useTowardsDebt, setUseTowardsDebt] = useState(resultSpending.useTowardsDebt.toString());
  const [useTowardsDebtType, setUseTowardsDebtType] = useState(resultSpending.useTowardsDebtType);

  const errors = useMemo(
    () => ({
      useTowardsDebt:
        useTowardsDebtType === "number"
          ? naturalNumber(useTowardsDebt)
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
      <AppTextFieldComponent
        id="useTowardsDebt"
        label={t("calculator:resultSpending.useTowardsDebt.label")}
        value={useTowardsDebt}
        className="m-2"
        error={!!errors["useTowardsDebt"]}
        helperText={t(errors["useTowardsDebt"])}
        onChange={(e) => setUseTowardsDebt(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" className="absolute right-2">
              <div>{useTowardsDebtType === "number" ? "kr" : "%"}</div>
            </InputAdornment>
          ),
        }}
      />
      <FormControl variant="outlined" className="m-2">
        <InputLabel id="type-label">
          {t("calculator:resultSpending.useTowardsDebtType.label")}
        </InputLabel>
        <Select
          labelId="type-label"
          id="type"
          value={useTowardsDebtType}
          label={t("calculator:resultSpending.useTowardsDebtType.label")}
          variant="outlined"
          MenuProps={{ disableScrollLock: true }}
          onChange={(e) => {
            setUseTowardsDebtType(e.target.value as "percentage" | "number");

            if (e.target.value === "number") {
              setUseTowardsDebt(resultSpendingValue.decimalPlaces(0).toString());
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
          <MenuItem value={"percentage"}>
            {t("calculator:resultSpending.useTowardsDebtType.options.percentage")}
          </MenuItem>
          <MenuItem value={"number"}>
            {t("calculator:resultSpending.useTowardsDebtType.options.number")}
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
