"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping and Delivery Policy"
      lastUpdated="December 18, 2024"
    >
      <div className="space-y-6 text-sm leading-relaxed">
        {/* 1. Nature of Service */}
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            1. Nature of Service
          </h2>
          <p>
            Penta Cab provides taxi and car rental services. All services
            offered are digital and service-based in nature. We do not sell,
            ship, or deliver any physical goods.
          </p>
        </section>

        {/* 2. Shipping Policy */}
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            2. Shipping Policy
          </h2>
          <p>
            Shipping is <strong>not applicable</strong> to our business model as
            we do not deal with physical products. No courier, logistics, or
            postal services are involved.
          </p>
        </section>

        {/* 3. Service Delivery */}
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            3. Service Delivery
          </h2>
          <p>
            The service is considered delivered when the cab arrives at the
            customer’s specified pickup location at the scheduled time and the
            trip is completed as per the booking details.
          </p>
        </section>

        {/* 4. Booking Confirmation */}
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            4. Booking Confirmation
          </h2>
          <p>
            Upon successful booking and payment (if applicable), customers
            receive a booking confirmation via SMS, email, or WhatsApp,
            containing trip and driver details.
          </p>
        </section>

        {/* 5. Service Availability */}
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            5. Service Availability
          </h2>
          <p>
            Our services are primarily available in Ahmedabad and major routes
            across Gujarat and neighboring states, subject to availability.
          </p>
        </section>

        {/* 6. Support & Contact */}
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            6. Contact & Support
          </h2>
          <p>
            For any questions related to service delivery, bookings, or support,
            please contact us using the details below:
          </p>
          <ul className="mt-2 list-disc list-inside">
            <li>
              <strong>Email:</strong> info.pentacab@gmail.com
            </li>
            <li>
              <strong>Phone:</strong> +91 76008 39900
            </li>
          </ul>
        </section>
      </div>
    </PolicyLayout>
  );
}
