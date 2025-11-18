import React, { forwardRef } from "react";
// @ts-ignore - inputTypography is exported from typography.ts
import { inputTypography } from "../styles/tokens/typography";
import { useResponsiveContainer } from "../layout/ResponsiveContainer";

type InputSize = "sm" | "md" | "lg";
type InputState = "default" | "hover" | "focus" | "error" | "disabled";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize; // Renamed from 'size' to avoid conflict
  state?: InputState;
  labelText?: string;
  helperText?: string;
  showLabel?: boolean;
  showHelperText?: boolean;
  requiredField?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const sizeStyles = {
  sm: "px-3 py-2 h-10",
  md: "px-4 py-3 h-14",
  lg: "px-6 py-4 h-16",
};

const sizeToTypography = {
  sm: "small",
  md: "medium",
  lg: "large",
} as const;

const stateStyles = {
  default:
    "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
  hover: "border-gray-400 bg-white",
  focus: "border-blue-500 ring-2 ring-blue-200 bg-white",
  error: "border-red-500 ring-2 ring-red-200 bg-white",
  disabled: "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize, // Changed from 'size' to 'inputSize'
    state = "default",
    labelText = "First Name",
    helperText = "We'll never share your details",
    showLabel = true,
    showHelperText = true,
    requiredField = false,
    leadingIcon,
    trailingIcon,
    className,
    disabled,
    ...rest
  },
  ref
) {
  const baseStyles =
    "w-full rounded-lg border outline-none transition-all duration-200 text-start";
  const { breakpoint } = useResponsiveContainer();

  // Responsive sizing based on breakpoints
  if (!inputSize) {
    const responsiveSizeClass = {
      sm: sizeStyles.sm,
      md: sizeStyles.md,
      lg: sizeStyles.lg,
      xl: sizeStyles.lg,
    }[breakpoint];

    const responsiveTextClass = {
      sm: inputTypography.medium,
      md: inputTypography.large,
      lg: inputTypography.large,
      xl: inputTypography.large,
    }[breakpoint];

    return (
      <div className="flex flex-col gap-2 w-full">
        {showLabel && (
          <label className="text-sm font-medium text-gray-700">
            {labelText}
            {requiredField && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leadingIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cx(
              baseStyles,
              stateStyles[state],
              responsiveSizeClass,
              responsiveTextClass,
              leadingIcon ? "pl-10" : "",
              trailingIcon ? "pr-10" : "",
              className
            )}
            disabled={disabled || state === "disabled"}
            placeholder={rest.placeholder || "Input text"}
            {...rest}
          />

          {trailingIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {trailingIcon}
            </div>
          )}
        </div>

        {showHelperText && helperText && (
          <p
            className={`text-xs ${
              state === "error" ? "text-red-600" : "text-gray-500"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // Fixed size (non-responsive)
  const typographyStyles = inputTypography[sizeToTypography[inputSize]];
  return (
    <div className="flex flex-col gap-2 w-full">
      {showLabel && (
        <label className="text-sm font-medium text-gray-700">
          {labelText}
          {requiredField && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leadingIcon}
          </div>
        )}

        <input
          ref={ref}
          className={cx(
            baseStyles,
            sizeStyles[inputSize],
            stateStyles[state],
            typographyStyles,
            leadingIcon ? "pl-10" : "",
            trailingIcon ? "pr-10" : "",
            className
          )}
          disabled={disabled || state === "disabled"}
          placeholder={rest.placeholder || "Input text"}
          {...rest}
        />

        {trailingIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {trailingIcon}
          </div>
        )}
      </div>

      {showHelperText && helperText && (
        <p
          className={`text-xs ${
            state === "error" ? "text-red-600" : "text-gray-500"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
