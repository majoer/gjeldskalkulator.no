import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactElement, useState } from "react";

export interface AppLoadingButtonFNProps {
  setLoading: (loading: boolean) => void;
}

export interface AppLoadingButtonProps extends Omit<ButtonProps, "children"> {
  children?: ReactElement | ((props: AppLoadingButtonFNProps) => ReactElement) | string;
}

const AppLoadingButton = <C extends React.ElementType>(
  props: Omit<ButtonProps<C, { component?: C }>, "children"> & AppLoadingButtonProps
) => {
  const [loading, setLoading] = useState(false);
  const c = typeof props.children === "function" ? props.children({ setLoading }) : props.children;

  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      onClick={(...e) => {
        if (typeof props.children !== "function") {
          setLoading(true);
        }

        if (props.onClick) {
          props.onClick(...e);
        }
      }}
    >
      <span className={` ${loading ? "invisible" : "visible"}`}>{c}</span>
      {loading ? <CircularProgress color="primary" size={20} className="absolute" /> : null}
    </Button>
  );
};

export default AppLoadingButton;
