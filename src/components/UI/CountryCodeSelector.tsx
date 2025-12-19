"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  countryCodes,
  CountryCode,
  getDefaultCountry,
} from "@/data/countryCodes";
import { Flag } from "./Flag";

interface CountryCodeSelectorProps {
  value: string;
  onChange: (dialCode: string) => void;
  theme?: {
    colors: {
      primary: {
        black: string;
      };
      border: {
        light: string;
        gold?: string;
      };
      text: {
        primary?: string;
        secondary?: string;
      };
    };
  };
}

export const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  value,
  onChange,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultTheme = {
    colors: {
      primary: {
        black: "#000000",
      },
      border: {
        light: "rgba(255, 255, 255, 0.1)",
        gold: "#FFD700",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#E5E5E5",
      },
    },
  };

  const activeTheme = theme || defaultTheme;

  const selectedCountry =
    countryCodes.find((country) => country.dialCode === value) ||
    getDefaultCountry();

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (country: CountryCode) => {
    onChange(country.dialCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-3 rounded-lg text-white focus:outline-none focus:ring-2 text-sm flex-shrink-0 min-w-[80px] justify-between"
        style={{
          background: activeTheme.colors.primary.black,
          border: `1px solid ${activeTheme.colors.border.light}`,
          color: activeTheme.colors.text.primary || "#FFFFFF",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor =
            activeTheme.colors.border.gold || "#FFD700";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = activeTheme.colors.border.light;
        }}
      >
        <span className="flex items-center gap-1.5">
          <Flag
            countryCode={selectedCountry.code}
            flagEmoji={selectedCountry.flag}
            useImage={true}
            size={20}
            className="flex-shrink-0"
            style={{ verticalAlign: "middle" }}
          />
          <span>{selectedCountry.dialCode}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden flex flex-col"
          style={{
            background: activeTheme.colors.primary.black,
            border: `1px solid ${activeTheme.colors.border.light}`,
            minWidth: "280px",
            maxWidth: "320px",
          }}
        >
          {/* Search input */}
          <div
            className="p-2 border-b"
            style={{ borderColor: activeTheme.colors.border.light }}
          >
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:ring-1"
              style={{
                background: activeTheme.colors.primary.black,
                border: `1px solid ${activeTheme.colors.border.light}`,
                color: activeTheme.colors.text.primary || "#FFFFFF",
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Country list */}
          <div className="overflow-y-auto max-h-64">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-2 text-left hover:bg-opacity-50 flex items-center gap-3 transition-colors"
                  style={{
                    background:
                      country.dialCode === value
                        ? "rgba(255, 215, 0, 0.2)"
                        : "transparent",
                    color: activeTheme.colors.text.primary || "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    if (country.dialCode !== value) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (country.dialCode !== value) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      width: "28px",
                      height: "20px",
                      marginRight: "12px",
                    }}
                  >
                    <Flag
                      countryCode={country.code}
                      flagEmoji={country.flag}
                      useImage={true}
                      size={28}
                    />
                  </span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span
                    className="text-sm opacity-70 flex-shrink-0"
                    style={{
                      color: activeTheme.colors.text.secondary || "#E5E5E5",
                    }}
                  >
                    {country.dialCode}
                  </span>
                </button>
              ))
            ) : (
              <div
                className="px-4 py-3 text-center text-sm"
                style={{
                  color: activeTheme.colors.text.secondary || "#E5E5E5",
                }}
              >
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
