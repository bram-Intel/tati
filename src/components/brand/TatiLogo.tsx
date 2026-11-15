"use client";

import React from "react";

interface TatiButterflyProps {
  size?: number;
  variant?: "gold" | "ivory" | "raspberry" | "footer";
  className?: string;
}

export function TatiButterfly({
  size = 24,
  variant = "gold",
  className,
}: TatiButterflyProps) {
  const strokeColor =
    variant === "ivory"
      ? "#FFF1DD"
      : variant === "raspberry"
        ? "#DB2850"
        : variant === "footer"
          ? "#F2A0A4"
          : "#D9A078";

  const fillColor =
    variant === "ivory"
      ? "rgba(255, 241, 221, 0.24)"
      : variant === "raspberry"
        ? "rgba(219, 40, 80, 0.14)"
        : variant === "footer"
          ? "rgba(242, 160, 164, 0.2)"
          : "rgba(217, 160, 120, 0.26)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", flexShrink: 0 }}
    >
      {/* Left Upper Wing */}
      <path
        d="M16.8 16.2C13.5 9.2 4.5 8.5 5.2 16.5C5.7 21.3 12.1 21.8 16.6 18.6Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right Upper Wing */}
      <path
        d="M19.2 16.2C22.5 9.2 31.5 8.5 30.8 16.5C30.3 21.3 23.9 21.8 19.4 18.6Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left Lower Wing */}
      <path
        d="M16.6 19.4C11.8 20.8 7.5 26.2 11.4 28.4C14.8 30.2 16.9 24.8 17.2 20.6Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      {/* Right Lower Wing */}
      <path
        d="M19.4 19.4C24.2 20.8 28.5 26.2 24.6 28.4C21.2 30.2 19.1 24.8 18.8 20.6Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      {/* Body & Antennae */}
      <line
        x1="18"
        y1="11.5"
        x2="18"
        y2="25.5"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 11.5C16.8 8.4 14.8 6.8 13.1 6.2"
        stroke={strokeColor}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M18 11.5C19.2 8.4 21.2 6.8 22.9 6.2"
        stroke={strokeColor}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="13" cy="6.2" r="1.1" fill={strokeColor} />
      <circle cx="23" cy="6.2" r="1.1" fill={strokeColor} />
    </svg>
  );
}

interface TatiLogoProps {
  variant?: "dark" | "light" | "footer";
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

export function TatiLogo({
  variant = "dark",
  size = "md",
  showDot = true,
}: TatiLogoProps) {
  const fontSize = size === "sm" ? 30 : size === "lg" ? 56 : 42;
  const bSize = size === "sm" ? 20 : size === "lg" ? 34 : 25;

  const textColor =
    variant === "light"
      ? "#FFF1DD"
      : variant === "footer"
        ? "#F2A0A4"
        : "#DB2850";

  const dotColor =
    variant === "light"
      ? "#FFF1DD"
      : variant === "footer"
        ? "#F27F49"
        : "#F27F49";

  const bVariant =
    variant === "light" ? "ivory" : variant === "footer" ? "footer" : "gold";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "lg" ? 10 : 7,
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize,
        lineHeight: 0.95,
        color: textColor,
        letterSpacing: "-0.02em",
      }}
    >
      <span>
        Tati
        {showDot && <span style={{ color: dotColor }}>.</span>}
      </span>
      <span
        style={{
          display: "inline-flex",
          transform: "translateY(-4px) rotate(11deg)",
        }}
      >
        <TatiButterfly size={bSize} variant={bVariant} />
      </span>
    </span>
  );
}
