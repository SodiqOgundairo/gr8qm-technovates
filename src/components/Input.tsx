import React from "react";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  className,
  type = "text",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`rounded-md px-6 py-2 font-normal w-full h-[47px] border border-[var(--color-gray-1)] text-[var(--color-gray-1)] focus:bg-[var(--color-iceblue)] focus:text-[var(--color-oxford)] focus:border-none focus:outline-[var(--color-dark)] ${className}`}
    />
  );
};

export default Input;
