"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "@/config/environment";
import { theme } from "@/styles/theme";
import { ThemedSelect } from "@/components/UI/ThemedSelect";
import { ThemedInput } from "@/components/UI/ThemedInput";
import { ThemedDatePicker } from "@/components/UI/ThemedDatePicker";
import { ThemedTimePicker } from "@/components/UI/ThemedTimePicker";
import { ThemedButton } from "@/components/UI/ThemedButton";
import { ContactInfo } from "@/components/ContactInfo";

// Helper function to get today's date in DD-MM-YY format
const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

// Helper function to get current time in 12-hour format with AM/PM
const getCurrentTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  return `${hours}:${minutes} ${period}`;
};

const UserLocalRide = () => {
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    city: "",
    package: "",
    date: getTodayDate(),
    time: getCurrentTime(),
    name: "",
    phoneNumber: "",
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [travellerInfo, setTravellerInfo] = useState({
    name: "",
    mobile: "",
    email: "",
    pickupAddress: "",
    dropAddress: "",
    remark: "",
    gst: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.name || formData.name.trim() === "") {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      setError("Please enter your phone number.");
      return;
    }

    // Validate phone number format (should be at least 10 digits)
    if (formData.phoneNumber.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    setLoading(true);

    try {
      // Check if "Other" is selected
      if (formData.city === "Other") {
        // Send email to admin about unavailable service
        try {
          await fetch(`${environment.baseUrl}/send-other-local-inquiry`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              city: formData.city,
              package: formData.package,
              date: formData.date,
              pickupTime: formData.time,
              name: formData.name,
              phoneNumber: formData.phoneNumber,
            }),
          });
          console.log("Other service inquiry email sent to admin successfully");
        } catch (emailErr) {
          console.error(
            "Failed to send other service inquiry email:",
            emailErr
          );
        }

        // Show contact info page
        setShowContactInfo(true);
        setLoading(false);
        return;
      }

      // First, send inquiry email to admin
      try {
        await fetch(`${environment.baseUrl}/send-local-inquiry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: formData.city,
            package: formData.package,
            date: formData.date,
            pickupTime: formData.time,
            name: formData.name,
            phoneNumber: formData.phoneNumber,
          }),
        });
        console.log("Local inquiry email sent to admin successfully");
      } catch (emailErr) {
        console.error("Failed to send local inquiry email:", emailErr);
        // Continue with the flow even if email fails
      }

      const response = await axios.post(
        `${environment.baseUrl}/api/local-ride/search`,
        {
          city: formData.city.toLowerCase(),
          package: formData.package,
        }
      );

      if (response.data.cars.length === 0) {
        setError("No available cars for this selection.");
        return;
      }

      // Prepare booking data for navigation
      const bookingData = {
        serviceType: "LOCAL",
        tripType: "ONEWAY",
        city: formData.city,
        package: formData.package,
        date: formData.date,
        pickupTime: formData.time,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        // Add API response data
        apiCabs: JSON.stringify(response.data.cars),
        apiResponse: JSON.stringify(response.data),
      };

      // Convert booking data to URL search params
      const searchParams = new URLSearchParams();
      Object.entries(bookingData).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });

      // Navigate to cab-lists page
      window.location.href = `/cab-lists?${searchParams.toString()}`;
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${environment.baseUrl}/api/available-cities`)
      .then((res) => res.json())
      .then((data) => setCities(data.cities))
      .catch((err) => console.error(err));
  }, []);

  const handleTravellerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTravellerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCarSelect = (car: any) => {
    setSelectedCar(car);
  };

  const handleFinalSubmit = async () => {
    if (!travellerInfo.email || !travellerInfo.name || !travellerInfo.mobile) {
      return alert("Please fill all required traveller info.");
    }

    const routeSummary = `${formData.city} | ${formData.package} | ${formData.date} ${formData.time}`;

    try {
      await axios.post(`${environment.baseUrl}/send-local-email`, {
        email: travellerInfo.email,
        route: routeSummary,
        car: selectedCar,
        traveller: travellerInfo,
      });

      alert("Email sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    }
  };

  if (showContactInfo) {
    return (
      <ContactInfo
        serviceType="LOCAL"
        searchDetails={{
          city: formData.city,
          package: formData.package,
          date: formData.date,
          time: formData.time,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        }}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0 max-w-md mx-auto sm:max-w-none">
      {/* Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h3
          className="font-bold text-lg sm:text-xl lg:text-2xl px-2 leading-tight"
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.sans.join(", "),
            fontWeight: theme.typography.fontWeight.bold,
          }}
        >
          HOURLY RENTALS WITHIN THE CITY
        </h3>
      </div>

      {!selectedCar && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* City Selection */}
          <div className="space-y-2">
            <label
              className="block text-sm sm:text-base font-medium px-1"
              style={{
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.sans.join(", "),
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              CITY
            </label>
            <ThemedSelect
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              options={[
                ...cities.map((city: string) => ({
                  value: city,
                  label: city,
                })),
                { value: "Other", label: "Other" },
              ]}
              placeholder="Select City"
            />
          </div>

          {/* Package Selection */}
          <div className="space-y-2">
            <label
              className="block text-sm sm:text-base font-medium px-1"
              style={{
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.sans.join(", "),
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              PACKAGE
            </label>
            <ThemedSelect
              value={formData.package}
              onChange={(e) => handleChange("package", e.target.value)}
              options={[
                { value: "4hr/40km", label: "4hr/40km" },
                { value: "8hr/80km", label: "8hr/80km" },
                { value: "12hr/120km", label: "12hr/120km" },
                { value: "Full Day", label: "Full Day" },
              ]}
              placeholder="Select Package"
            />
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label
                className="block text-sm sm:text-base font-medium px-1"
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.sans.join(", "),
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                DATE
              </label>
              <ThemedDatePicker
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm sm:text-base font-medium px-1"
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.sans.join(", "),
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                PICKUP TIME
              </label>
              <ThemedTimePicker
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
          </div>

          {/* Customer Details Section - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label
                className="block text-sm sm:text-base font-medium px-1"
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.sans.join(", "),
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                NAME
              </label>
              <ThemedInput
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm sm:text-base font-medium px-1"
                style={{
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.sans.join(", "),
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                PHONE NUMBER
              </label>
              <ThemedInput
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "");
                  handleChange("phoneNumber", numericValue);
                }}
                required
              />
            </div>
          </div>

          <ThemedButton
            onClick={() => handleSubmit({} as React.FormEvent)}
            disabled={loading}
            loading={loading}
            className="w-full"
          >
            Search Cabs
          </ThemedButton>
        </form>
      )}

      {/* Show Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UserLocalRide;
