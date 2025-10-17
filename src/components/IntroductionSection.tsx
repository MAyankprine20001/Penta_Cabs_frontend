import React from "react";

interface IntroductionSectionProps {
  className?: string;
}

const IntroductionSection: React.FC<IntroductionSectionProps> = ({
  className = "",
}) => {
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
      text: {
        primary: "#FFFFFF",
        secondary: "#E5E5E5",
        muted: "#B0B0B0",
      },
    },
    gradients: {
      cardGradient: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
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

  return (
    <section className={`py-16 lg:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-8"
            style={{
              color: theme.colors.accent.gold,
              textShadow: `0 4px 20px rgba(255, 215, 0, 0.4)`,
              fontWeight: theme.typography.fontWeight.bold,
            }}
          >
            Introduction
          </h2>

          <div
            className="max-w-4xl mx-auto rounded-2xl p-8 lg:p-12"
            style={{
              background: theme.gradients.cardGradient,
              border: `2px solid ${theme.colors.accent.gold}`,
              boxShadow: `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.3)`,
            }}
          >
            <p
              className="text-lg lg:text-xl leading-relaxed"
              style={{
                color: theme.colors.text.secondary,
                fontWeight: theme.typography.fontWeight.medium,
                lineHeight: "1.8",
              }}
            >
              PentaCab is more than just a cab service; it's a smart
              transportation solution that simplifies your travel using advanced
              technology. From our user-friendly mobile app to our GPS-enabled
              vehicles, PentaCab ensures that every journey is smooth and
              efficient. We are redefining urban mobility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
