import React from "react";
import type { CharmProduct } from "@/config/catalog";

interface CharmMedallionShowcaseProps {
  charm: CharmProduct;
}

export function CharmMedallionShowcase({ charm }: CharmMedallionShowcaseProps) {
  return (
    <div className="tati-medallion-stage" aria-hidden="true">
      <div
        className="tati-medallion-halo"
        style={{
          background: `radial-gradient(circle, ${charm.enamelHex}29 0%, rgba(217, 160, 120, 0.16) 48%, transparent 72%)`,
        }}
      />

      <svg
        width="176"
        height="196"
        viewBox="0 0 176 196"
        fill="none"
        className="tati-medallion-svg"
      >
        <defs>
          <linearGradient id={`gold-${charm.id}`} x1="28" y1="10" x2="148" y2="176" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5DCC3" />
            <stop offset="48%" stopColor="#D9A078" />
            <stop offset="100%" stopColor="#B87D55" />
          </linearGradient>
          <linearGradient id={`enamel-${charm.id}`} x1="50" y1="70" x2="128" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={charm.enamelHex} stopOpacity="1" />
            <stop offset="100%" stopColor={charm.enamelHex} stopOpacity="0.82" />
          </linearGradient>
        </defs>

        {/* Hinged clasp ring + delicate champagne-gold links */}
        <circle
          cx="88"
          cy="28"
          r="13"
          stroke={`url(#gold-${charm.id})`}
          strokeWidth="3.2"
        />
        <rect
          x="84.5"
          y="39"
          width="7"
          height="14"
          rx="3.5"
          stroke={`url(#gold-${charm.id})`}
          strokeWidth="2.6"
        />
        <circle
          cx="88"
          cy="58"
          r="5"
          stroke={`url(#gold-${charm.id})`}
          strokeWidth="2.4"
        />

        {charm.symbol === "butterfly" && (
          <g transform="translate(88 118)">
            <path
              d="M0 -8 C-14 -36 -50 -40 -54 -14 C-58 7 -32 18 -10 15 C-32 23 -38 49 -20 56 C-6 61 0 38 0 18 C0 38 6 61 20 56 C38 49 32 23 10 15 C32 18 58 7 54 -14 C50 -40 14 -36 0 -8 Z"
              fill={`url(#enamel-${charm.id})`}
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="4.2"
              strokeLinejoin="round"
            />
            <line
              x1="0"
              y1="-18"
              x2="0"
              y2="24"
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M0 -18 C-4 -30 -11 -35 -16 -36 M0 -18 C4 -30 11 -35 16 -36"
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {charm.symbol === "heart" && (
          <g transform="translate(88 122)">
            <path
              d="M0 44 C0 44 -48 16 -48 -14 C-48 -33 -33 -46 -17 -46 C-7 -46 0 -39 0 -39 C0 -39 7 -46 17 -46 C33 -46 48 -33 48 -14 C48 16 0 44 0 44 Z"
              fill={`url(#enamel-${charm.id})`}
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="5.2"
              strokeLinejoin="round"
            />
            <path
              d="M-31 -19 C-29 -29 -21 -35 -12 -35"
              stroke="#FFF8EE"
              strokeOpacity="0.48"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        )}

        {charm.symbol === "starburst" && (
          <g transform="translate(88 118)">
            <path
              d="M0 -52 L11 -16 L46 -26 L20 0 L48 24 L12 16 L0 52 L-12 16 L-48 24 L-20 0 L-46 -26 L-11 -16 Z"
              fill={`url(#gold-${charm.id})`}
              stroke="#B87D55"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle
              cx="0"
              cy="0"
              r="11"
              fill={`url(#enamel-${charm.id})`}
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="3.2"
            />
          </g>
        )}

        {charm.symbol === "blossom" && (
          <g transform="translate(88 118)">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle
                key={deg}
                cx={Math.sin((deg * Math.PI) / 180) * 26}
                cy={-Math.cos((deg * Math.PI) / 180) * 26}
                r="19"
                fill={`url(#enamel-${charm.id})`}
                stroke={`url(#gold-${charm.id})`}
                strokeWidth="3.8"
              />
            ))}
            <circle
              cx="0"
              cy="0"
              r="13"
              fill={`url(#gold-${charm.id})`}
            />
            <circle cx="0" cy="0" r="5" fill="#FFF8EE" fillOpacity="0.6" />
          </g>
        )}

        {charm.symbol === "monogram" && (
          <g transform="translate(88 118)">
            <circle
              cx="0"
              cy="0"
              r="44"
              fill={`url(#enamel-${charm.id})`}
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="5"
            />
            <circle
              cx="0"
              cy="0"
              r="36"
              stroke={`url(#gold-${charm.id})`}
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <path
              d="M-16 -14 H20 M2 -14 L-6 18 M-14 18 H4"
              stroke={`url(#gold-${charm.id})`}
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
