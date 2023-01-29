import Delete from "@mui/icons-material/Delete";
import Settings from "@mui/icons-material/Settings";
import { debounce } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DebtState, DebtType, removeDebt, updateDebt } from "../store/debt-slice";
import { useAppDispatch } from "../store/store";
import { nowPlusMonths } from "../utils/time";
import { naturalNumber, positiveNumberInc0 } from "../validation/validation";
import AppTextFieldComponent from "./io/app-text-field-component";

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
  const [advanced, setAdvanced] = useState(false);
  const [expectedEndDate, setExpectedEndDate] = useState<Dayjs | null>(
    debt.termins ? nowPlusMonths(debt.termins) : null
  );
  const [fee, setFee] = useState("" + debt.fee);
  const { id } = debt;

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
    debounce(({ name, amount, interest, fee, debtType, expectedEndDate, errors }) => {
      const fullUpdate: Partial<DebtState> = {
        name,
        amount: parseInt(amount, 10),
        interest,
        fee: parseInt(fee, 10),
        type: debtType,
        termins: expectedEndDate ? Math.abs(dayjs().diff(expectedEndDate, "month")) : undefined,
      };

      const changes: Partial<DebtState> = Object.keys(errors)
        .filter((field) => !errors[field])
        .reduce((update, field) => {
          update[field] = fullUpdate[field];
          return update;
        }, {});

      dispatch(updateDebt({ id, changes }));
    }, 600),
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
    <div className="relative py-4 sm:m-2  sm:py-1">
      <div className="w-3/4 md:w-5/6 flex flex-col sm:flex-row">
        <AppTextFieldComponent
          id="name"
          type="text"
          label={t("calculator:debt.name.label")}
          className="m-2 shrink-0 grow-0"
          value={name}
          error={!!errors["name"]}
          helperText={t(errors["name"])}
          onChange={(e) => setName(e.target.value)}
        />
        <AppTextFieldComponent
          id="amount"
          type="text"
          label={t("calculator:debt.amount.label")}
          className="m-2 shrink-0 grow-0 "
          inputProps={{ pattern: "\\d*" }}
          value={amount}
          error={!!errors["amount"]}
          helperText={t(errors["amount"])}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-2">
                <div>kr</div>
              </InputAdornment>
            ),
          }}
        />
        <AppTextFieldComponent
          id="interest"
          type="text"
          label={t("calculator:debt.interest.label")}
          className="m-2 shrink-0 grow-0"
          inputProps={{ pattern: "\\d*" }}
          value={interest}
          error={!!errors["interest"]}
          helperText={t(errors["interest"])}
          onChange={(e) => setInterest(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="absolute right-2">
                <div>%</div>
              </InputAdornment>
            ),
          }}
        />
        <div className="relative text-center">
          <IconButton
            title={t(`calculator:debt.advancedSettings.${advanced ? "less" : "more"}.title`)}
            className={` sm:absolute sm:top-1/2 sm:-translate-y-1/2 transition-transform ${
              advanced ? "rotate-90" : "rotate-0"
            }`}
            color={advanced ? "primary" : "default"}
            onClick={() => setAdvanced(!advanced)}
          >
            <Settings></Settings>
          </IconButton>
        </div>
      </div>
      {advanced ? (
        <div className="w-3/4 md:w-5/6 flex flex-col sm:flex-row">
          <AppTextFieldComponent
            id="fee"
            type="text"
            label={t("calculator:debt.fee.label")}
            className="m-2 shrink-0 grow-0"
            inputProps={{ pattern: "\\d*" }}
            value={fee}
            error={!!errors["fee"]}
            helperText={t(errors["fee"])}
            onChange={(e) => setFee(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" className="absolute right-2">
                  <div>kr</div>
                </InputAdornment>
              ),
            }}
          />

          <FormControl variant="outlined" className="m-2 shrink-0 grow-0">
            <InputLabel id="type-label">{t("calculator:debt.type.label")}</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              value={debtType}
              label={t("calculator:debt.type.label")}
              variant="outlined"
              MenuProps={{ disableScrollLock: true }}
              sx={{
                width: {
                  xs: "auto",
                  sm: "10rem",
                },
              }}
              onChange={(e) => {
                const newDebtType = e.target.value as DebtType;
                setDebtType(newDebtType);
                if (newDebtType !== "credit" && !expectedEndDate) {
                  setExpectedEndDate(dayjs().add(10, "years"));
                }
              }}
            >
              <MenuItem value={"annuity"} title={t("calculator:debt.type.options.annuity.title")}>
                {t("calculator:debt.type.options.annuity.label")}
              </MenuItem>
              <MenuItem value={"credit"} title={t("calculator:debt.type.options.credit.title")}>
                {t("calculator:debt.type.options.credit.label")}
              </MenuItem>
              <MenuItem value={"serie"} title={t("calculator:debt.type.options.serie.title")}>
                {t("calculator:debt.type.options.serie.label")}
              </MenuItem>
            </Select>
          </FormControl>

          {debtType !== "credit" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="m-2 shrink-0 grow-0 w-auto sm:w-40"
                label={t("calculator:debt.endDate.label")}
                value={expectedEndDate}
                disablePast={true}
                openTo="year"
                onChange={(newValue) => {
                  setExpectedEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
              />
            </LocalizationProvider>
          ) : null}
        </div>
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
  );
}
