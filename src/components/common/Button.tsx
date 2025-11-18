import React, { forwardRef } from "react";
import { useResponsiveContainer } from "../layout/ResponsiveContainer";

type ButtonSize = "sm" | "md" | "lg" | "xl";
type ButtonVariant = "primary" | "tertiary" | "ghost";

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
  md: "px-4 py-3 h-14", // 56px = 3.5rem = h-14
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

const variantStyles = {
  primary: "bg-[#92c656] text-gray-900 hover:bg-green-500 rounded-md",
  tertiary:
    "bg-gray-200 text-gray-900 border border-1 border-gray-300 rounded-full shadow-sm shadwo-gray-300 hover:bg-gray-300 hover:border-2",
  ghost: "bg-none text-gray-900, border-none rounded-0",
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
      "inline-flex items-center justify-center transition-colors select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed";
    const widthStyles = fullWidth ? "w-full" : "";

    // Use responsive container context when available, fallback to window-based breakpoints
    const { breakpoint } = useResponsiveContainer();

    // Responsive sizing based on breakpoints
    // Mobile first: sm size for mobile, md for tablet, lg for desktop
    if (!size) {
      // Determine responsive classes based on container breakpoint
      const responsiveSizeClass = {
        sm: sizeStyles.sm,
        md: sizeStyles.md,
        lg: sizeStyles.lg,
        xl: sizeStyles.lg, // Use lg for xl container size
      }[breakpoint];

      const responsiveTextClass = {
        sm: 'text-sm', // Mobile: lg text (14px)
        md: 'text-base', // Tablet: xl text (18px)
        lg: 'text-lg', // Desktop: xl text (18px)
        xl: 'text-xl', // Extra large: xl text (18px)
      }[breakpoint];

      return (
        <button
          ref={ref}
          className={cx(
            baseStyles,
            variantStyles[variant],
            responsiveSizeClass,
            responsiveTextClass,
            widthStyles,
            className
          )}
          type={rest.type ?? "button"}
          {...rest}
        >
          {children}
        </button>
      );
    }

    // Fixed size (non-responsive)
    const typographyStyles = buttonTypography[sizeToTypography[size]];
    return (
      <button
        ref={ref}
        className={cx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          typographyStyles,
          widthStyles,
          className
        )}
        type={rest.type ?? "button"}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
