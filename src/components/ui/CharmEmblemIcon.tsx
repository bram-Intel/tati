import React from "react";
import type { CharmProduct } from "@/config/catalog";

interface CharmEmblemIconProps {
  symbol: CharmProduct["symbol"];
  size?: number;
  className?: string;
}

export function CharmEmblemIcon({
  symbol,
  size = 15,
  className,
}: CharmEmblemIconProps) {
  if (symbol === "butterfly") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <path
          d="M12 10.5C9.8 6.4 5.2 4.6 3.5 7.4C2.3 9.4 4.6 12.1 8.4 12.5C5.2 13.4 4 16.5 5.8 18.2C7.4 19.7 10.4 17.5 12 14.3C13.6 17.5 16.6 19.7 18.2 18.2C20 16.5 18.8 13.4 15.6 12.5C19.4 12.1 21.7 9.4 20.5 7.4C18.8 4.6 14.2 6.4 12 10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7.5V16.5M12 7.5C11.4 5.8 10.5 4.8 9.6 4.4M12 7.5C12.6 5.8 13.5 4.8 14.4 4.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (symbol === "heart") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <path
          d="M12 19.6C12 19.6 4.2 14.6 4.2 9.1C4.2 6.6 6.1 4.8 8.4 4.8C9.9 4.8 11.2 5.6 12 6.9C12.8 5.6 14.1 4.8 15.6 4.8C17.9 4.8 19.8 6.6 19.8 9.1C19.8 14.6 12 19.6 12 19.6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (symbol === "starburst") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <path
          d="M12 2.8L13.9 9.2L20.5 12L13.9 14.8L12 21.2L10.1 14.8L3.5 12L10.1 9.2L12 2.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      </svg>
    );
  }

  if (symbol === "blossom") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={className}
      >
        <path
          d="M12 4.2C13.6 4.2 14.6 5.6 14 7.4C15.8 6.5 17.6 7.3 18.1 8.8C18.6 10.3 17.5 11.7 15.6 12C17.1 13.2 17.3 15.1 16 16.3C14.7 17.5 12.9 17.1 12 15.4C11.1 17.1 9.3 17.5 8 16.3C6.7 15.1 6.9 13.2 8.4 12C6.5 11.7 5.4 10.3 5.9 8.8C6.4 7.3 8.2 6.5 10 7.4C9.4 5.6 10.4 4.2 12 4.2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="11.2" r="1.7" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.8 9.2H15.8M12.3 9.2L11 16.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
