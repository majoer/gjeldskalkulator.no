import Badge from "@mui/material/Badge";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Head from "next/head";
import { useState } from "react";
import AppChartComponent from "../components/app-chart-component";
import AppUserInputComponent from "../components/app-user-input-component";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";
import CreditCard from "@mui/icons-material/CreditCard";
import ShowChart from "@mui/icons-material/ShowChart";
import AppPaymentPlanComponent from "../components/app-payment-plan-component";
import AppTipsComponent from "../components/app-tips-component";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="h-full-header w-full"
      {...other}
    >
      {value === index && (
        <div className="h-full w-full pt-4 p-2">{children}</div>
      )}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="min-h-screen">
          <div className=" w-1/2 min-h-screen bg-slate-100 p-1 rounded">
            <AppUserInputComponent />
          </div>
          <div className="w-1/2 fixed top-0 bottom-0 right-0">
            <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
              <Tab label="Chart" icon={<ShowChart />}></Tab>
              <Tab label="Payment plan" icon={<CreditCard />}></Tab>
              <Tab
                label="Tips"
                icon={
                  <Badge badgeContent={4} color="primary">
                    <TipsAndUpdates />
                  </Badge>
                }
              ></Tab>
            </Tabs>
            <TabPanel value={tab} index={0}>
              <AppChartComponent />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <AppPaymentPlanComponent />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <AppTipsComponent />
            </TabPanel>
          </div>
        </div>
      </main>

      <footer></footer>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}