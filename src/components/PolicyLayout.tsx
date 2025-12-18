// src/components/PolicyLayout.tsx
"use client";

import React from "react";
import { theme } from "@/styles/theme";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export const PolicyLayout: React.FC<PolicyLayoutProps> = ({
  title,
  lastUpdated,
  children,
}) => {
  return (
    <div
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.colors.primary.black }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl p-8 sm:p-12 border"
          style={{
            backgroundColor: theme.colors.background.card,
            borderColor: `${theme.colors.accent.gold}20`,
          }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-center"
            style={{
              color: theme.colors.accent.gold,
              fontFamily: theme.typography.fontFamily.display.join(", "),
            }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p
              className="text-sm mb-8 text-center"
              style={{ color: theme.colors.text.muted }}
            >
              Last Updated: {lastUpdated}
            </p>
          )}
          <div
            className="prose prose-invert max-w-none"
            style={{
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.sans.join(", "),
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
