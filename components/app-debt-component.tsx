import Delete from "@mui/icons-material/Delete";
import Info from "@mui/icons-material/Info";
import { debounce } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { setOpenTips, updateNavigation } from "../store/debt-insight-slice";
import {
  DebtState,
  DebtType,
  removeDebt,
  updateDebt,
} from "../store/debt-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppDispatch, useAppSelector } from "../store/store";
import { nowPlusMonths } from "../utils/time";
import { naturalNumber, positiveNumberInc0 } from "../validation/validation";
import { TAB_TIPS } from "./app-debt-insight";

export interface AppLoanProps {
  debt: DebtState;
}

export default function AppDebtComponent({ debt }: AppLoanProps) {
  const { t } = useTranslation(["calculator"]);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(debt.name);
  const [amount, setAmount] = useState("" + debt.amount);
  const [interest, setInterest] = useState(debt.interest);
  const [debtType, setDebtType] = useState(debt.type);
  const [expectedEndDate, setExpectedEndDate] = useState<Dayjs | null>(
    debt.termins ? nowPlusMonths(debt.termins) : null
  );
  const [fee, setFee] = useState("" + debt.fee);
  const { id } = debt;
  const { tipIdMap } = useAppSelector(selectTips);

  const errors = useMemo(
    () => ({
      name: undefined,
      amount: naturalNumber(amount),
      interest: positiveNumberInc0(interest),
      fee: naturalNumber(fee),
      type: undefined,
      termins: undefined,
    }),
    [amount, interest, fee]
  );

  const debouncedUpdate = useCallback(
    debounce(
      ({ name, amount, interest, fee, debtType, expectedEndDate, errors }) => {
        const fullUpdate: Partial<DebtState> = {
          name,
          amount: parseInt(amount, 10),
          interest,
          fee: parseInt(fee, 10),
          type: debtType,
          termins: expectedEndDate
            ? Math.abs(dayjs().diff(expectedEndDate, "month"))
            : undefined,
        };

        const changes: Partial<DebtState> = Object.keys(errors)
          .filter((field) => !errors[field])
          .reduce((update, field) => {
            update[field] = fullUpdate[field];
            return update;
          }, {});

        dispatch(updateDebt({ id, changes }));
      },
      600
    ),
    []
  );

  useEffect(() => {
    debouncedUpdate({
      name,
      amount,
      interest,
      fee,
      debtType,
      expectedEndDate,
      errors,
    });
  }, [name, amount, interest, fee, debtType, expectedEndDate, errors]);

  return (
    <div className="relative py-4 sm:py-1">
      <div className="sm:m-2 w-3/4 md:w-5/6 flex flex-col sm:flex-row flex-wrap">
        <TextField
          id="name"
          type="text"
          label={t("calculator:debt.name.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          value={name}
          error={!!errors["name"]}
          helperText={t(errors["name"])}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="amount"
          type="text"
          label={t("calculator:debt.amount.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={amount}
          error={!!errors["amount"]}
          helperText={t(errors["amount"])}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                <div>kr</div>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="interest"
          type="text"
          label={t("calculator:debt.interest.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0 w-auto sm:w-16"
          inputProps={{ pattern: "\\d*" }}
          value={interest}
          error={!!errors["interest"]}
          helperText={t(errors["interest"])}
          onChange={(e) => setInterest(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                <div>%</div>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="fee"
          type="text"
          label={t("calculator:debt.fee.label")}
          variant="standard"
          className="m-2 shrink-0 grow-0 w-auto sm:w-16"
          inputProps={{ pattern: "\\d*" }}
          value={fee}
          error={!!errors["fee"]}
          helperText={t(errors["fee"])}
          onChange={(e) => setFee(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-0">
                <div>kr</div>
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="standard" className="m-2 shrink-0 grow-0">
          <InputLabel id="type-label">
            {t("calculator:debt.type.label")}
          </InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={debtType}
            label={t("calculator:debt.type.label")}
            variant="standard"
            MenuProps={{ disableScrollLock: true }}
            inputProps={{ className: "w-full" }}
            onChange={(e) => {
              const newDebtType = e.target.value as DebtType;
              setDebtType(newDebtType);
              if (newDebtType !== "credit") {
                setExpectedEndDate(dayjs().add(10, "years"));
              }
            }}
          >
            <MenuItem
              value={"annuity"}
              title={t("calculator:debt.type.options.annuity.title")}
            >
              {t("calculator:debt.type.options.annuity.label")}
            </MenuItem>
            <MenuItem
              value={"credit"}
              title={t("calculator:debt.type.options.credit.title")}
            >
              {t("calculator:debt.type.options.credit.label")}
            </MenuItem>
            <MenuItem
              value={"serie"}
              title={t("calculator:debt.type.options.serie.title")}
            >
              {t("calculator:debt.type.options.serie.label")}
            </MenuItem>
          </Select>
        </FormControl>

        {debtType !== "credit" ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="m-2 shrink-0 grow-0 w-auto sm:w-32"
              label={t("calculator:debt.endDate.label")}
              value={expectedEndDate}
              onChange={(newValue) => {
                setExpectedEndDate(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" />
              )}
            />
          </LocalizationProvider>
        ) : null}

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
                  })
                );
              }}
            >
              <Info className={tipIdMap[id].color} />
            </IconButton>
          </Tooltip>
        ) : null}

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <IconButton
            color="secondary"
            title={t("calculator:debt.remove.title")}
            onClick={() => dispatch(removeDebt(id))}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
