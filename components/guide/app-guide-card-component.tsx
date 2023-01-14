import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Box from "@mui/system/Box";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

interface Step {
  step: string;
  title: string;
}

export interface AppGuideCardComponentProps {
  steps: Step[];
  currentStep: number;
  children: ReactElement;
}

export default function AppGuideCardComponent({
  steps,
  currentStep,
  children,
}: AppGuideCardComponentProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="w-full text-center">
      <div className="w-full h-3/6 xl:mt-32">
        <Card
          elevation={10}
          className="relative lg:w-2/3 xl:w-5/12 lg:m-auto p-6"
        >
          <Stepper>
            {steps.map((step, i) => (
              <Step
                key={i}
                completed={i < currentStep}
                active={i === currentStep}
              >
                <StepLabel>{t(step.step)}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <CardHeader
            title={t(steps[currentStep].title)}
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
