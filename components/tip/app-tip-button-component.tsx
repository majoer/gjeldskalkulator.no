import Info from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { setOpenTips, updateNavigation } from "../../store/debt-insight-slice";
import { selectTips } from "../../store/selectors/tips-selector";
import { useAppDispatch } from "../../store/store";
import { TAB_TIPS } from "../app-debt-insight";

export interface AppTipButtonComponentProps {
  id: string;
}

export default function AppTipButtonComponent({ id }: AppTipButtonComponentProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { tipIdMap } = useSelector(selectTips);

  return (
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
  );
}
