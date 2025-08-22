import { forwardRef, useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import type { TextFieldProps } from "@mui/material/TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "InputProps"> & {
  InputProps?: TextFieldProps["InputProps"];
};

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ InputProps, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <TextField
        {...props}
        type={show ? "text" : "password"}
        inputRef={ref}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShow((s) => !s)}
                edge="end"
                tabIndex={-1}
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          ...(InputProps || {}),
        }}
      />
    );
  }
);

PasswordField.displayName = "PasswordField";
export default PasswordField;
