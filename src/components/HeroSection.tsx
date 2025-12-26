"use client";

import React from "react";
// Theme configuration
const theme = {
  colors: {
    primary: {
      black: "#000000",
      darkGray: "#1a1a1a",
    },
    accent: {
      gold: "#FFD700",
      lightGold: "#FFF700",
    },
    secondary: {
      amber: "#FFA500",
      warmYellow: "#FFB84D",
      lightAmber: "#FFCC80",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#E5E5E5",
      muted: "#B0B0B0",
    },
    background: {
      primary: "#000000",
      dark: "#0a0a0a",
      gradient:
        "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
    },
    border: {
      gold: "#FFD700",
      goldLight: "#FFF700",
      light: "rgba(255, 255, 255, 0.1)",
    },
    shadow: {
      gold: "rgba(255, 215, 0, 0.4)",
      primary: "rgba(0, 0, 0, 0.8)",
      elevated: "rgba(0, 0, 0, 0.6)",
    },
  },
  gradients: {
    heroGradient:
      "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)",
    gold: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    enhancedBackground:
      "linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)",
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    fontWeight: {
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

const HeroSection: React.FC = () => {
  return (
    <section
      className="min-h-[150px] sm:min-h-[180px] lg:min-h-[200px] flex items-center justify-center overflow-hidden w-full py-8"
      style={{
        background: theme.gradients.enhancedBackground,
      }}
    >
      <div className="w-full h-full">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Content - Text Section */}
          <div
            className={`text-center lg:text-left space-y-6 flex items-center justify-center lg:justify-center px-4 sm:px-6 lg:px-8 w-full`}
          >
            {/* Welcome Text */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-none flex flex-wrap items-center justify-center gap-2"
              style={{
                fontFamily: theme.typography.fontFamily.sans.join(", "),
              }}
            >
              <span
                style={{
                  color: theme.colors.text.primary,
                  textShadow: `0 4px 20px ${theme.colors.shadow.primary}`,
                }}
              >
                Welcome to
              </span>
              <span
                style={{
                  color: theme.colors.accent.gold,
                  textShadow: `0 4px 20px ${theme.colors.shadow.gold}`,
                }}
              >
                Penta Cab
              </span>
            </h1>
          </div>

          {/* Right Content - Image Section */}
          {/* <div className={`w-full lg:w-1/2 h-full flex items-center justify-center`}>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/cab_image.png"
                alt="Penta Cab - Premium Taxi Service"
                className="w-full h-full object-cover object-center opacity-80"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: 0.8,
                  width: "80%",
                  height: "80%",
                }}
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
