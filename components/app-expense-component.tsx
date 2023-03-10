import Delete from "@mui/icons-material/Delete";
import Info from "@mui/icons-material/Info";
import { debounce } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { setOpenTips, updateNavigation } from "../store/debt-insight-slice";
import {
  ExpenseState,
  removeExpense,
  selectAllExpenses,
  updateExpense,
} from "../store/expense-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppDispatch, useAppSelector } from "../store/store";
import { naturalNumber } from "../validation/validation";
import { TAB_TIPS } from "./app-debt-insight";
import AppTextFieldComponent from "./io/app-text-field-component";

export interface AppExpenseProps {
  expense: ExpenseState;
}

export const allOptions = {
  rent: { defaultAmount: 10000, synonyms: [] },
  electricity: { defaultAmount: 3000, synonyms: [] },
  transportation: { defaultAmount: 3000, synonyms: [] },
  food: { defaultAmount: 5000, synonyms: [] },
  clothes: { defaultAmount: 2000, synonyms: [] },
  internet: { defaultAmount: 1000, synonyms: [] },
  phone: { defaultAmount: 500, synonyms: [] },
  streaming: { defaultAmount: 400, synonyms: [] },
  household: { defaultAmount: 1000, synonyms: ["living"] },
  hobby: { defaultAmount: 500, synonyms: [] },
  savings: { defaultAmount: 1000, synonyms: ["stocks"] },
  vacation: { defaultAmount: 1000, synonyms: ["travel"] },
  medicine: { defaultAmount: 1000, synonyms: [] },
  alcohol: { defaultAmount: 1000, synonyms: [] },
  childSupport: { defaultAmount: 10000, synonyms: [] },
  children: { defaultAmount: 10000, synonyms: [] },
  other: { defaultAmount: 0, synonyms: [] },
};

export type ExpenseOptionName = keyof typeof allOptions;
export const ExpenseOptionNames = Object.keys(allOptions) as ExpenseOptionName[];

interface ExpenseOption {
  id: string;
  label: string;
}

export default function AppExpenseComponent({ expense }: AppExpenseProps) {
  const { t } = useTranslation(["calculator"]);
  const dispatch = useAppDispatch();
  const [customName, setCustomName] = useState(allOptions[expense.name] ? "" : expense.name);
  const [knownName, setKnownName] = useState<ExpenseOption | null>(
    allOptions[expense.name]
      ? {
          id: expense.name,
          label: t(`calculator:expense.options.${expense.name}`),
        }
      : null
  );
  const [amount, setAmount] = useState("" + expense.amount);
  const { id } = expense;
  const { tipIdMap } = useAppSelector(selectTips);
  const allExpenses = useAppSelector(selectAllExpenses);
  const resolvedOptions = useMemo(() => {
    return Object.keys(allOptions)
      .flatMap((key) => allOptions[key].synonyms.concat([key]))
      .map((option) => ({
        label: t(`calculator:expense.options.${option}`, {}),
        id: option,
      }));
  }, [t]);

  const synonyms = useMemo(
    () =>
      Object.keys(allOptions).reduce((map, key) => {
        allOptions[key].synonyms.forEach(
          (synonym) =>
            (map[synonym] = {
              id: key,
              label: t(`calculator:expense.options.${key}`),
            })
        );
        return map;
      }, {}),
    [t]
  );

  useEffect(() => {
    if (knownName) {
      setKnownName({
        ...knownName,
        label: t(`calculator:expense.options.${expense.name}`),
      });
    }
  }, [t]);

  const options: ExpenseOption[] = useMemo(
    () => resolvedOptions.filter(({ id }) => !allExpenses.find((e) => e.name === id)).sort(),
    [allExpenses, resolvedOptions]
  );

  const errors = useMemo(
    () => ({
      name: undefined,
      amount: naturalNumber(amount),
    }),
    [customName, amount]
  );

  const debouncedUpdate = useCallback(
    debounce(({ knownName, customName, amount, errors }) => {
      console.log(customName, knownName);
      const fullUpdate: Partial<ExpenseState> = {
        name: customName === knownName?.label ? knownName.id : customName,
        amount: parseInt(amount, 10),
      };

      const changes: Partial<ExpenseState> = Object.keys(errors)
        .filter((field) => !errors[field])
        .reduce((update, field) => {
          update[field] = fullUpdate[field];
          return update;
        }, {});
      dispatch(updateExpense({ id, changes }));
    }, 600),
    []
  );

  useEffect(() => {
    debouncedUpdate({ knownName, customName, amount, errors });
  }, [knownName, customName, amount, errors]);

  return (
    <div className="relative py-4 sm:py-1">
      <div className="sm:m-2 w-3/4 flex flex-col sm:flex-row flex-wrap">
        <Autocomplete
          id="expenseName"
          multiple={false}
          freeSolo={true}
          className="m-2 shrink-0 grow-0 inline-flex"
          options={options}
          value={knownName}
          inputValue={customName}
          onInputChange={(_, newName) => setCustomName(newName)}
          sx={{
            "& .MuiFormControl-root .MuiInputBase-root": {
              padding: 0,
            },
          }}
          ChipProps={{ className: "pr-0" }}
          onChange={(e_, value) => {
            if (value === null) {
              setKnownName(null);
            } else if (typeof value !== "string") {
              setKnownName(synonyms[value.id] ? synonyms[value.id] : value);
            }
          }}
          renderInput={(params) => (
            <AppTextFieldComponent
              {...params}
              inputProps={{
                ...params.inputProps,
                className: "w-full",
              }}
              label={t("calculator:expense.name.label")}
            />
          )}
        />
        <AppTextFieldComponent
          id="amount"
          type="text"
          label={t("calculator:expense.amount.label")}
          className="m-2 shrink-0 grow-0"
          value={amount}
          error={!!errors["amount"]}
          helperText={t(errors["amount"])}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-2">
                {tipIdMap[id] ? (
                  <Tooltip
                    title={t("calculator:tipsPanel.tooltip.title", {
                      value: t(`calculator:tips.${tipIdMap[id].tipId}.summary`),
                    })}
                  >
                    <IconButton
                      onClick={() => {
                        dispatch(
                          updateNavigation({
                            activeTab: TAB_TIPS,
                          })
                        );
                        dispatch(
                          setOpenTips({
                            [tipIdMap[id].tipId]: true,
                            ...(knownName
                              ? {
                                  [`${tipIdMap[id].tipId}-${knownName.id}`]: true,
                                }
                              : {}),
                          })
                        );
                      }}
                    >
                      <Info className={tipIdMap[id].color} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <div>kr</div>
                )}
              </InputAdornment>
            ),
          }}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton
            title={t("calculator:expense.remove.title")}
            color="secondary"
            onClick={() => dispatch(removeExpense(id))}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
