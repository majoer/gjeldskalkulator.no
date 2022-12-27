import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import AppBudgetComponent from "./app-budget-component";
import AppLoansComponent from "./app-loans-component";

export default function AppUserInputComponent() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Box>
      <Box>
        <Tabs
          centered={true}
          value={activeTab}
          onChange={(_, newValue: number) => setActiveTab(newValue)}
        >
          <Tab label="Budget" />
          <Tab label="Loans" />
        </Tabs>
      </Box>
      <div hidden={activeTab !== 0}>
        <AppBudgetComponent />
      </div>
      <div hidden={activeTab !== 1}>
        <AppLoansComponent />
      </div>
      <div></div>
    </Box>
  );
}
