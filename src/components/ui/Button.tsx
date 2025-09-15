import React from "react";
import Image from "next/image";

export type ButtonVariant = "filled" | "outlined" | "basic" | "link";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  className?: string;
  label?: string | React.ReactNode;
  loadingLabel?: string;
  disabled?: boolean;
  radius?: ButtonRadius;
  loading?: boolean;
  fullWidth?: boolean;
  ariaLabel: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  size = "md",
  leftIcon,
  rightIcon,
  className = "",
  label,
  disabled = false,
  radius = "md",
  loading,
  loadingLabel = "",
  fullWidth = false,
  onClick,
  ariaLabel,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium *:transition-all !duration-300 focus:outline-none relative overflow-hidden";
  const variants: Record<ButtonVariant, string> = {
    filled:
      "bg-primary-3 text-base-6 hover:bg-white hover:[box-shadow:_0_1px_23.5px_0_rgba(255,_255,_255,_0.25)] disabled:bg-gray-3 disabled:hover:bg-gray-3 disabled:text-gray-2",
    outlined:
      "bg-transparent text-primary-3 hover:bg-primary-3/10 border border-primary-3 disabled:hover:bg-transparent disabled:text-gray-3 disabled:border-gray-3",
    basic:
      "bg-transparent text-primary-2 hover:bg-primary-2/10 disabled:text-gray-3 disabled:hover:bg-transparent",
    link: "bg-transparent text-primary-1 p-0 hover:text-primary-2 border-none disabled:hover:text-primary-1",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: `${
      label || (loading && loadingLabel) ? "px-3 py-1" : "w-8"
    } text-sm h-8`,
    md: `${
      label || (loading && loadingLabel) ? "px-4 py-2" : "w-10"
    } text-base h-10`,
    lg: `${
      label || (loading && loadingLabel) ? "px-7 py-3" : "w-12"
    } text-lg h-12`,
  };
  const actionStyles: Record<"true" | "false", string> = {
    true: "cursor-default",
    false: "cursor-pointer",
  };
  const radiusStyles: Record<ButtonRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const composed = [
    base,
    variants[variant],
    sizes[size],
    className,
    actionStyles[String(disabled) as "true" | "false"],
    radiusStyles[radius],
    fullWidth ? "w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      data-variant={variant}
      data-size={size}
      className={composed}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {variant === "filled" && (
        <>
          <Image
            src={"/static/images/button-gradient.svg"}
            alt=""
            fill
            className="absolute -bottom-6 -right-12 z-[0] max-md:hidden"
          />
          <Image
            src={"/static/images/button-gradient-mobile.svg"}
            alt=""
            fill
            className="absolute -bottom-6 -right-12 z-[0] md:hidden"
          />
        </>
      )}
      {leftIcon && (
        <>
          {loading ? (
            <span
              className={`animate-spin icon-loading z-[1] ${
                loadingLabel ? "mr-2" : ""
              }`}
            ></span>
          ) : (
            <span className={`${leftIcon} ${label ? "mr-2" : ""} z-[1]`}>
              {typeof leftIcon !== "string" ? leftIcon : null}
            </span>
          )}
        </>
      )}
      {loading && !leftIcon && !rightIcon && (
        <span
          className={`animate-spin icon-loading z-[1] ${
            loadingLabel ? "mr-2" : ""
          }`}
        ></span>
      )}
      <span
        className="truncate max-w-full overflow-hidden text-ellipsis block z-[1]"
        style={{ minWidth: 0 }}
        title={(() => {
          const text = loading ? loadingLabel : label;
          return typeof text === "string" && text ? text : undefined;
        })()}
      >
        {loading ? loadingLabel : label}
      </span>
      {rightIcon && (
        <>
          {loading ? (
            <span
              className={`animate-spin icon-loading z-[1] ${
                loadingLabel ? "ml-2" : ""
              }`}
            ></span>
          ) : (
            <span className={`${rightIcon} ${label ? "ml-2" : ""} z-[1]`}>
              {typeof rightIcon !== "string" ? rightIcon : null}
            </span>
          )}
        </>
      )}
    </button>
  );
};
