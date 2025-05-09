import React from "react";

interface LabelProps {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none ${className}`}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = "Label";

export { Label };
