import { ReactElement } from "react";

export interface AppTipWrapperComponentProps {
  children: ReactElement[];
}

export default function AppTipWrapperComponent({ children }: AppTipWrapperComponentProps) {
  return <>{children}</>;
}
