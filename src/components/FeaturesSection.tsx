import React from "react";

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
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
      gold: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
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

  const features = [
    {
      icon: "📍",
      title: "Pickup & Drop-off Selection",
      description:
        "Easy input of locations, with auto-suggestions and map-pinning.",
    },
    {
      icon: "🎯",
      title: "Real-time Location Detection",
      description: "Automatically detects the user's current location via GPS.",
    },
    {
      icon: "🚗",
      title: "Vehicle Selection",
      description:
        "Options for different car types (Economy, Sedan, SUV, Luxury, etc.) with clear pricing.",
    },
    {
      icon: "💰",
      title: "Fare Estimation",
      description:
        "Transparent, upfront fare calculation based on distance, time, and vehicle type before booking.",
    },
    {
      icon: "⏰",
      title: "Ride Now/Schedule for Later",
      description:
        "Option for immediate bookings or scheduling rides in advance.",
    },
    {
      icon: "🏔️",
      title: "Multiple Stops",
      description:
        "Ability to add multiple drop-off points during a single trip.",
    },
    {
      icon: "📊",
      title: "Dynamic Pricing",
      description:
        "Real-time adjustment of fares based on demand, traffic, and supply.",
    },
    {
      icon: "⭐",
      title: "Smart Matching Algorithm",
      description:
        "More intelligent matching of drivers to passengers based on proximity, route, and historical preferences.",
    },
  ];

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
            Features
          </h2>

          <h3
            className="text-xl lg:text-2xl font-semibold mb-12"
            style={{
              color: theme.colors.text.secondary,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            A. Intuitive Booking Process
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-xl p-6 transition-all duration-500 hover:scale-105"
              style={{
                background: theme.gradients.cardGradient,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6)`,
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${theme.colors.accent.gold}60 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: theme.gradients.gold,
                    boxShadow: `0 8px 25px rgba(255, 215, 0, 0.3)`,
                  }}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h4
                  className="text-lg font-semibold mb-3 text-center"
                  style={{
                    color: theme.colors.text.primary,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  {feature.title}
                </h4>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed text-center"
                  style={{
                    color: theme.colors.text.muted,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Loyalty Section */}
        <div className="mt-16">
          <h3
            className="text-xl lg:text-2xl font-semibold mb-8 text-center"
            style={{
              color: theme.colors.text.secondary,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            B. Customer Loyalty & Rewards
          </h3>

          <div
            className="max-w-4xl mx-auto rounded-2xl p-8"
            style={{
              background: theme.gradients.cardGradient,
              border: `2px solid ${theme.colors.accent.gold}`,
              boxShadow: `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.3)`,
            }}
          >
            <p
              className="text-lg leading-relaxed text-center"
              style={{
                color: theme.colors.text.secondary,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              Earn points with every ride and unlock exclusive rewards,
              discounts, and premium benefits. Our loyalty program ensures that
              frequent travelers get the most value from their journey with
              PentaCab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
