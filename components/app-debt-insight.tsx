import CreditCard from "@mui/icons-material/CreditCard";
import ShowChart from "@mui/icons-material/ShowChart";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";
import Badge from "@mui/material/Badge";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AppChartComponent from "../components/app-chart-component";
import AppPaymentPlanComponent from "../components/app-payment-plan-component";
import AppTipsComponent from "../components/app-tips-component";
import { selectActiveTab, updateNavigation } from "../store/debt-insight-slice";
import { selectTips } from "../store/selectors/tips-selector";
import { useAppDispatch, useAppSelector } from "../store/store";

export const TAB_GRAPH = 0;
export const TAB_PLAN = 1;
export const TAB_TIPS = 2;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  scrollable: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, scrollable, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={`h-full-header w-full ${scrollable ? "overflow-y-auto" : ""}`}
      {...other}
    >
      {value === index && (
        <div className="h-full w-full pt-4 p-2">{children}</div>
      )}
    </div>
  );
}

export default function AppDebtInsightComponent() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const { allRelevantTips } = useAppSelector(selectTips);

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_, newTab) =>
          dispatch(updateNavigation({ activeTab: newTab }))
        }
      >
        <Tab label="Chart" icon={<ShowChart />}></Tab>
        <Tab label="Payment plan" icon={<CreditCard />}></Tab>
        <Tab
          label="Tips"
          icon={
            <Badge badgeContent={allRelevantTips.length} color="primary">
              <TipsAndUpdates />
            </Badge>
          }
        ></Tab>
      </Tabs>
      <TabPanel value={activeTab} index={TAB_GRAPH} scrollable={false}>
        <AppChartComponent />
      </TabPanel>
      <TabPanel value={activeTab} index={TAB_PLAN} scrollable={true}>
        <AppPaymentPlanComponent />
      </TabPanel>
      <TabPanel value={activeTab} index={TAB_TIPS} scrollable={false}>
        <AppTipsComponent />
      </TabPanel>
    </>
  );
}