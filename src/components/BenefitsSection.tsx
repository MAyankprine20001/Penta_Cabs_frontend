import React from "react";

interface BenefitsSectionProps {
  className?: string;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
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

  const benefits = [
    {
      category: "A. Convenience and Ease",
      items: [
        {
          icon: "⚡",
          title: "Book Anywhere, Anytime",
          description:
            "Users can book a ride 24/7 from any location with internet access, eliminating the need to wait on the street or haggle with drivers.",
        },
        {
          icon: "🕐",
          title: "Save Time",
          description:
            "With just a few clicks, users can enter pickup and drop-off locations and confirm their booking, saving time and allowing for efficient daily planning.",
        },
      ],
    },
    {
      category: "B. Transparency",
      items: [
        {
          icon: "💰",
          title: "Upfront Fare Estimates",
          description:
            "Before confirming a booking, users will see an estimated fare for their trip, ensuring no hidden charges and enabling effective budgeting.",
        },
        {
          icon: "👤",
          title: "Driver & Vehicle Details",
          description:
            "Once a booking is confirmed, users receive necessary details such as the driver's name, mobile number, vehicle number, and model, to help identify the correct cab.",
        },
      ],
    },
    {
      category: "C. Safety and Reliability",
      items: [
        {
          icon: "📍",
          title: "Real-time Tracking",
          description:
            "Users can track their booked cab live on a map, knowing its exact location and estimated arrival time. During the trip, live location can also be shared with trusted contacts.",
        },
        {
          icon: "⭐",
          title: "Verified Drivers",
          description:
            "PentaCab ensures all its drivers are thoroughly vetted and trained, providing a safe and secure journey.",
        },
      ],
    },
    {
      category: "D. Multiple Options & Customization",
      items: [
        {
          icon: "🚗",
          title: "Vehicle Choices",
          description:
            "Users can select from various vehicle types (e.g., Economy, Sedan, SUV, Luxury) to suit their specific needs and budget.",
        },
        {
          icon: "📅",
          title: "Schedule a Ride",
          description:
            "Beyond instant bookings, users can schedule rides in advance for future trips, ensuring punctuality for important appointments.",
        },
        {
          icon: "🌍",
          title: "Outstation or Hourly Bookings",
          description:
            "The website offers options for intercity travel and hourly bookings, providing flexibility for different travel needs.",
        },
      ],
    },
    {
      category: "E. Digital Payments",
      items: [
        {
          icon: "💳",
          title: "Cashless Transactions",
          description:
            "Users can pay securely and conveniently using credit/debit cards, UPI, or their PentaCab wallet, eliminating the need to carry cash.",
        },
        {
          icon: "📋",
          title: "Payment History",
          description:
            "Users can access a clear record of all their past payments and trips on the website for easy tracking.",
        },
      ],
    },
    {
      category: "F. Enhanced Customer Support",
      items: [
        {
          icon: "🎧",
          title: "Direct Support Access",
          description:
            "Through the website, users can directly reach out to PentaCab's customer support team for any issues or queries, ensuring prompt resolution of their concerns.",
        },
      ],
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
            Benefits
          </h2>
        </div>

        <div className="space-y-12">
          {benefits.map((benefit, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category Title */}
              <h3
                className="text-xl lg:text-2xl font-semibold mb-8"
                style={{
                  color: theme.colors.accent.gold,
                  fontWeight: theme.typography.fontWeight.semibold,
                  textShadow: `0 2px 10px rgba(255, 215, 0, 0.3)`,
                }}
              >
                {benefit.category}
              </h3>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefit.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
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
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: theme.gradients.gold,
                          boxShadow: `0 8px 25px rgba(255, 215, 0, 0.3)`,
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* Title */}
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{
                          color: theme.colors.text.primary,
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        {itemIndex + 1}. {item.title}
                      </h4>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: theme.colors.text.muted,
                          fontWeight: theme.typography.fontWeight.medium,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
