import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, disabled, className = "", ...props }, ref) => (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <span className="relative">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer appearance-none h-5 w-5 border border-primary rounded-sm checked:bg-primary checked:border-transparent focus:outline-none focus:ring-2 focus:ring-ring transition"
          {...props}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white peer-checked:opacity-100 opacity-0 transition">
          <Check className="w-4 h-4" />
        </span>
      </span>
    </label>
  )
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
