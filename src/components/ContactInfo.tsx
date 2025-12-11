"use client";

import React from "react";
import { theme } from "@/styles/theme";
import { FaPhone, FaEnvelope } from "react-icons/fa";

interface ContactInfoProps {
  serviceType: "OUTSTATION" | "LOCAL" | "AIRPORT";
  searchDetails?: {
    from?: string;
    to?: string;
    city?: string;
    airport?: string;
    package?: string;
    date?: string;
    time?: string;
    name?: string;
    phoneNumber?: string;
  };
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  serviceType,
  searchDetails,
}) => {
  const phoneNumber = "+91 7600839900";
  const email = "info.pentacab@gmail.com";

  const getServiceName = () => {
    switch (serviceType) {
      case "OUTSTATION":
        return "Intercity/Outstation";
      case "LOCAL":
        return "Local";
      case "AIRPORT":
        return "Airport";
      default:
        return "Service";
    }
  };

  return (
    <div
      className="p-4 sm:p-6 md:p-8 rounded-lg border space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden"
      style={{
        backgroundColor: theme.colors.background.card,
        borderColor: theme.colors.border.goldLight,
      }}
    >
      <div className="text-center space-y-2">
        <h2
          className="text-xl sm:text-2xl font-bold"
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.sans.join(", "),
          }}
        >
          Service Not Available
        </h2>
        <p
          className="text-sm sm:text-base"
          style={{
            color: theme.colors.text.muted,
            fontFamily: theme.typography.fontFamily.sans.join(", "),
          }}
        >
          The {getServiceName()} service you requested is currently not available
          in our system. We&apos;ve notified our team about your inquiry.
        </p>
      </div>

      {searchDetails && (
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.background.secondary,
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.sans.join(", "),
            }}
          >
            Your Request Details:
          </h3>
          <div className="space-y-2 text-sm">
            {searchDetails.from && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>From:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.from}
                </span>
              </div>
            )}
            {searchDetails.to && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>To:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.to}
                </span>
              </div>
            )}
            {searchDetails.city && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>City:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.city}
                </span>
              </div>
            )}
            {searchDetails.airport && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>Airport:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.airport}
                </span>
              </div>
            )}
            {searchDetails.package && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>Package:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.package}
                </span>
              </div>
            )}
            {searchDetails.date && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>Date:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.date}
                </span>
              </div>
            )}
            {searchDetails.time && (
              <div className="flex justify-between">
                <span style={{ color: theme.colors.text.muted }}>Time:</span>
                <span style={{ color: theme.colors.text.primary }}>
                  {searchDetails.time}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <p
          className="text-base font-medium"
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.sans.join(", "),
          }}
        >
          Please contact us directly for assistance:
        </p>

        <div className="space-y-3">
          {/* Phone Number */}
          <a
            href="tel:917600839900"
            className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border transition-all hover:scale-105 w-full"
            style={{
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border.goldLight,
              color: theme.colors.text.primary,
            }}
          >
            <FaPhone
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              style={{ color: theme.colors.accent.gold }}
            />
            <span
              className="text-sm sm:text-lg font-semibold break-words text-center"
              style={{
                fontFamily: theme.typography.fontFamily.sans.join(", "),
              }}
            >
              {phoneNumber}
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border transition-all hover:scale-105 w-full"
            style={{
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.border.goldLight,
              color: theme.colors.text.primary,
            }}
          >
            <FaEnvelope
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              style={{ color: theme.colors.accent.gold }}
            />
            <span
              className="text-xs sm:text-base md:text-lg font-semibold break-words text-center"
              style={{
                fontFamily: theme.typography.fontFamily.sans.join(", "),
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {email}
            </span>
          </a>
        </div>

        <p
          className="text-xs sm:text-sm mt-4"
          style={{
            color: theme.colors.text.muted,
            fontFamily: theme.typography.fontFamily.sans.join(", "),
          }}
        >
          Our team will get back to you as soon as possible to help with your
          booking request.
        </p>
      </div>
    </div>
  );
};

