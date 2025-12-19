"use client";
import React, { useState } from "react";
import { getFlagEmoji, getImageFlag } from "@/utils/flagUtils";

interface FlagProps {
  countryCode: string;
  flagEmoji?: string;
  useImage?: boolean;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Flag component that displays country flags
 * Uses image flags by default (more reliable), with emoji fallback
 */
export const Flag: React.FC<FlagProps> = ({
  countryCode,
  flagEmoji,
  useImage = true, // Default to image flags
  size = 40,
  className = "",
  style = {},
}) => {
  const [imageError, setImageError] = useState(false);
  const emoji = flagEmoji || getFlagEmoji(countryCode);

  // Use image flags by default, fallback to emoji if image fails to load
  if (useImage && !imageError) {
    const flagUrl = getImageFlag(countryCode, size);
    return (
      <img
        src={flagUrl}
        alt={`${countryCode} flag`}
        className={className}
        style={{
          width: `${size}px`,
          height: `${size * 0.75}px`,
          minWidth: `${size}px`,
          minHeight: `${size * 0.75}px`,
          objectFit: "cover",
          display: "block",
          borderRadius: "2px",
          flexShrink: 0,
          border: "none",
          ...style,
        }}
        onError={(e) => {
          console.warn(
            `Flag image failed to load for ${countryCode}:`,
            flagUrl
          );
          setImageError(true);
        }}
        onLoad={() => {
          // Image loaded successfully
        }}
      />
    );
  }

  // Fallback to emoji if image fails or useImage is false
  return (
    <span
      className={className}
      style={{
        fontSize: `${size * 0.75}px`,
        lineHeight: "1",
        display: "inline-block",
        fontFamily:
          "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Segoe UI Symbol, sans-serif",
        ...style,
      }}
      role="img"
      aria-label={`${countryCode} flag`}
    >
      {emoji}
    </span>
  );
};
