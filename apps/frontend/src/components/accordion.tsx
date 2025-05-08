import React, { useState, ReactNode } from "react";

interface AccordionProps {
  children: ReactNode;
}

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="border rounded-md divide-y">{children}</div>;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 px-4 font-medium hover:underline focus:outline-none"
      >
        {title}
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 px-4 text-sm ${
          open ? "max-h-screen pb-4" : "max-h-0"
        }`}
      >
        {open && children}
      </div>
    </div>
  );
};
