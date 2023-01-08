import Delete from "@mui/icons-material/Delete";
import Info from "@mui/icons-material/Info";
import { debounce } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateNavigation, setOpenTips } from "../store/debt-insight-slice";
import {
  ExpenseState,
  removeExpense,
  selectAllExpenses,
  updateExpense,
} from "../store/expense-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppDispatch, useAppSelector } from "../store/store";
import { positiveInteger } from "../validation/validation";
import { TAB_TIPS } from "./app-debt-insight";

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
export const ExpenseOptionNames = Object.keys(
  allOptions
) as ExpenseOptionName[];

interface ExpenseOption {
  id: string;
  label: string;
}

export default function AppExpenseComponent({ expense }: AppExpenseProps) {
  const { t } = useTranslation(["calculator"]);
  const dispatch = useAppDispatch();
  const [customName, setCustomName] = useState("");
  const [knownName, setKnownName] = useState<ExpenseOption | null>(
    expense.name
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
    setKnownName({
      ...knownName,
      label: t(`calculator:expense.options.${expense.name}`),
    });
  }, [t]);

  const options: ExpenseOption[] = useMemo(
    () =>
      resolvedOptions
        .filter(({ id }) => !allExpenses.find((e) => e.name === id))
        .sort(),
    [allExpenses, resolvedOptions]
  );

  const errors = useMemo(
    () => ({
      name: undefined,
      amount: positiveInteger(amount),
    }),
    [customName, amount]
  );

  const debouncedUpdate = useCallback(
    debounce(({ knownName, amount, errors }) => {
      const fullUpdate: Partial<ExpenseState> = {
        name: knownName ? knownName.id : "",
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
    debouncedUpdate({ knownName, amount, errors });
  }, [knownName, amount, errors]);

  return (
    <div className="relative">
      <div className="m-2 flex flex-row flex-wrap justify-center lg:justify-start">
        <Autocomplete
          id="expenseName"
          multiple={false}
          freeSolo={true}
          sx={{ width: 200 }}
          className="m-2 shrink-0 grow-0 inline-flex"
          options={options}
          value={knownName}
          inputValue={customName}
          onInputChange={(_, newName) => setCustomName(newName)}
          onChange={(e_, value) => {
            if (value === null) {
              setKnownName(null);
            } else if (typeof value !== "string") {
              setKnownName(synonyms[value.id] ? synonyms[value.id] : value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t("calculator:expense.name.label")}
            />
          )}
        />
        <TextField
          id="amount"
          type="text"
          label={t("calculator:expense.amount.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          value={amount}
          error={!!errors["amount"]}
          helperText={t(errors["amount"])}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                {tipIdMap[id] ? (
                  <Tooltip
                    title={t("calculator:tips.tooltip.title", {
                      value: tipIdMap[id].summary,
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
                            [tipIdMap[id].summary]: true,
                            [`${tipIdMap[id].summary}-${customName}`]: true,
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
