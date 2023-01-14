import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Box from "@mui/system/Box";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface Step {
  step: string;
  href: string;
  title: string;
  component: React.ReactNode;
}

export interface AppGuideCardComponentProps {
  steps: Step[];
}

export default function AppGuideCardComponent({
  steps,
}: AppGuideCardComponentProps) {
  const router = useRouter();
  const path = router.asPath;
  const activeStep = useMemo(() => {
    const fragmentIndex = path.indexOf("#");
    if (fragmentIndex !== -1) {
      const fragment = path.substring(fragmentIndex, path.length);
      const index = steps.findIndex((s) => s.href === fragment);
      return index === -1 ? 0 : index;
    }
    return 0;
  }, [path]);

  return (
    <div className="w-full text-center">
      <div className="w-full h-3/6 xl:mt-32">
        <Card
          elevation={10}
          className="relative lg:w-2/3 xl:w-5/12 lg:m-auto p-6"
        >
          <Stepper>
            {steps.map((step, i) => (
              <Step key={i} completed={i <= activeStep}>
                <StepLabel>{step.step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <CardHeader
            title={steps[activeStep].title}
            titleTypographyProps={{ component: "h1" }}
            subheaderTypographyProps={{ component: "h2" }}
          />

          {steps[activeStep].component}
        </Card>
      </div>
      <Box className="w-full h-2/6"></Box>
    </div>
  );
}
