import TextField, { TextFieldProps } from "@mui/material/TextField";

export interface AppTextFieldComponentProps {}

const AppTextFieldComponent = (props: TextFieldProps & AppTextFieldComponentProps) => {
  return (
    <TextField variant="outlined" {...props}>
      {props.children}
    </TextField>
  );
};

export default AppTextFieldComponent;
