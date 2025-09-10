import { Field as ChakraField } from "@chakra-ui/react";
import { InfoTip } from "./toggle-tip";
import * as React from "react";
import { createContext, useContext } from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  infoText?: React.ReactNode;
  labelProps?: ChakraField.LabelProps;
}
const FieldContext = createContext<{ disabled?: boolean }>({});
export const FieldProvider = FieldContext.Provider;
export const useField = () => useContext(FieldContext);

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const {
      label,
      children,
      helperText,
      errorText,
      optionalText,
      infoText,
      ...rest
    } = props;
    return (
      <FieldProvider value={{ disabled: props.disabled }}>
        <ChakraField.Root ref={ref} {...rest}>
          {label && (
            <ChakraField.Label
              fontWeight="semibold"
              fontSize="sm"
              color={props.invalid ? "red.500" : "inherit"}
              {...props.labelProps}
            >
              {label}
              {infoText && <InfoTip> {infoText} </InfoTip>}
              <ChakraField.RequiredIndicator fallback={optionalText} />
            </ChakraField.Label>
          )}
          {children}
          {helperText && (
            <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
          )}
          {errorText && (
            <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>
          )}
        </ChakraField.Root>
      </FieldProvider>
    );
  },
);
