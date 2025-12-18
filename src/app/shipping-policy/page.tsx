// src/app/shipping-policy/page.tsx
"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping and Delivery Policy"
      lastUpdated="December 18, 2024"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            1. Nature of Service
          </h2>
          <p>
            Penta Cab provides taxi and car rental services. These are
            service-oriented products and do not involve the shipping or
            delivery of physical goods.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            2. Service Delivery
          </h2>
          <p>
            The service is considered "delivered" when the cab arrives at the
            specified pickup location at the scheduled time and completes the
            journey as requested by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            3. Booking Confirmation
          </h2>
          <p>
            Upon successful booking and payment (if applicable), customers will
            receive a confirmation via email or SMS with the details of the
            vehicle and driver assigned.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            4. Geographic Coverage
          </h2>
          <p>
            Our services are available in Ahmedabad and major routes across
            Gujarat and neighboring states as specified on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            5. Contact Us
          </h2>
          <p>
            If you have any questions regarding how our services are delivered,
            please contact us at info.pentacab@gmail.com.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
