import React, { forwardRef } from "react";
import { useResponsiveContainer } from "../layout/ResponsiveContainer";

type ButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const sizeStyles = {
  sm: "px-3 py-2 h-10",
  md: "px-4 py-3 h-14",
  lg: "px-6 py-4 h-14",
  xl: "px-8 py-5 h-18",
};

const sizeToTypography = {
  sm: "small",
  md: "medium",
  lg: "large",
  xl: "xlarge",
} as const;

const buttonTypography = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  xlarge: "text-xl",
} as const;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-skyblue)] text-white hover:bg-[var(--color-oxford)] rounded-md font-medium transition-colors",
  secondary: "btn-sec",
  ghost: "bg-transparent text-[var(--color-dark)] hover:bg-[var(--color-iceblue)] rounded-md font-medium transition-colors border border-[var(--color-gray-1)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children = "Button",
      size,
      variant = "primary",
      fullWidth,
      className,
      ...rest
    },
    ref
  ) {
    const baseStyles =
      "inline-flex items-center justify-center select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-skyblue)] disabled:opacity-50 disabled:cursor-not-allowed";
    const widthStyles = fullWidth ? "w-full" : "";

    const { breakpoint } = useResponsiveContainer();

    if (!size) {
      const responsiveSizeClass = {
        sm: sizeStyles.sm,
        md: sizeStyles.md,
        lg: sizeStyles.lg,
        xl: sizeStyles.lg,
      }[breakpoint];

      const responsiveTextClass = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      }[breakpoint];

      const variantClass = variantStyles[variant];
      const content = variant === 'secondary' ? (
        <span className="button-content">{children}</span>
      ) : (
        children
      );

      return (
        <button
          ref={ref}
          className={cx(
            baseStyles,
            variantClass,
            responsiveSizeClass,
            responsiveTextClass,
            widthStyles,
            className
          )}
          type={rest.type ?? "button"}
          {...rest}
        >
          {content}
        </button>
      );
    }

    const typographyStyles = buttonTypography[sizeToTypography[size]];
    const variantClass = variantStyles[variant];
    const content = variant === 'secondary' ? (
      <span className="button-content">{children}</span>
    ) : (
      children
    );

    return (
      <button
        ref={ref}
        className={cx(
          baseStyles,
          sizeStyles[size],
          variantClass,
          typographyStyles,
          widthStyles,
          className
        )}
        type={rest.type ?? "button"}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

export default Button;