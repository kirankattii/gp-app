"use client";

import Link from "next/link";

type Props = {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
  asLink?: boolean;
  href?: string;
  title?: string;
  noUnderline?: boolean;
  showLinkColor?: boolean; // applies GP green
};

const AppLink = ({
  children,
  onClick,
  className = "",
  asLink = false,
  href = "",
  title,
  noUnderline = false,
  showLinkColor = false,
}: Props) => {
  const baseStyles = `
    cursor-pointer transition-colors duration-150
    ${noUnderline ? "" : "hover:underline"}
    ${showLinkColor ? "text-[var(--gp-green)] hover:text-[var(--gp-brown)]" : ""}
  `;

  if (asLink) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${className}`}
        onClick={onClick}
        title={title}
      >
        {children}
      </Link>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <span
      role="button"
      tabIndex={0}
      className={`${baseStyles} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      title={title}
    >
      {children}
    </span>
  );};

export default AppLink;