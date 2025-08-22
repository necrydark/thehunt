"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group bg-black border-primary-green"
      style={
        {
          "--normal-bg": "#000000",
          "--normal-text": "#FFFFFF",
          "--normal-border": "var(--green)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
