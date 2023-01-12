import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/system/Box";

export interface AppGuideCardComponentProps {
  children: React.ReactNode;
  steps: string[];
  currentStep: number;
  title: string;
}

export default function AppGuideCardComponent({
  children,
  steps,
  currentStep,
  title,
}) {
  return (
    <div className="w-full h-screen text-center">
      <div className="w-full h-3/6 xl:mt-32">
        <Card
          elevation={10}
          className="relative lg:w-2/3 xl:w-5/12 lg:m-auto p-6"
        >
          <Stepper>
            {steps.map((step, i) => (
              <Step key={i} completed={currentStep >= i}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <CardHeader
            title={title}
            titleTypographyProps={{ component: "h1" }}
            subheaderTypographyProps={{ component: "h2" }}
          />

          {children}
        </Card>
      </div>
      <Box className="w-full h-2/6"></Box>
    </div>
  );
}
