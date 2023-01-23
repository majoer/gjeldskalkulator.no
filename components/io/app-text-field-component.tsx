import TextField, { TextFieldProps } from "@mui/material/TextField";

export interface AppTextFieldComponentProps {}

const AppTextFieldComponent = (props: TextFieldProps & AppTextFieldComponentProps) => {
  return (
    <TextField
      variant="outlined"
      sx={{
        width: {
          xs: "auto",
          sm: "10rem",
        },
        ...props.sx,
      }}
      className={`w-full sm:w-40 ${props.className}`}
      {...props}
    >
      {props.children}
    </TextField>
  );
};

export default AppTextFieldComponent;
