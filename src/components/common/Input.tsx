import React, { forwardRef } from "react";

type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  labelText?: string;
  showLabel?: boolean;
  requiredField?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const sizeStyles = {
  sm: "px-3 py-2 h-10 text-sm",
  md: "px-4 py-3 h-12 text-base",
  lg: "px-6 py-4 h-14 text-lg",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize = "md",
    labelText,
    showLabel = false,
    requiredField = false,
    leadingIcon,
    trailingIcon,
    className,
    ...rest
  },
  ref
) {
  const baseStyles =
    "w-full rounded-md border outline-none transition-all duration-200 text-start border-[var(--color-gray-1)] text-[var(--color-dark)] placeholder:text-[var(--color-gray-1)] focus:bg-[var(--color-iceblue)] focus:text-[var(--color-oxford)] focus:border-none focus:outline-[var(--color-dark)]";

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
            leadingIcon ? "pl-10" : "",
            trailingIcon ? "pr-10" : "",
            className
          )}
          {...rest}
        />

        {trailingIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {trailingIcon}
          </div>
        )}
      </div>
    </div>
  );
});

export default Input;
