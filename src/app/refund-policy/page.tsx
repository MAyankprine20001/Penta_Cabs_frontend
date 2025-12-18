// src/app/refund-policy/page.tsx
"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Refund and Cancellation Policy"
      lastUpdated="December 18, 2024"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            1. Cancellation by Customer
          </h2>
          <p>
            Customers may cancel their booking at any time. However, the
            following cancellation charges may apply:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Cancellation more than 24 hours before pickup: Full refund.</li>
            <li>Cancellation between 12-24 hours before pickup: 50% refund.</li>
            <li>Cancellation less than 12 hours before pickup: No refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            2. Cancellation by Penta Cab
          </h2>
          <p>
            In rare cases where we are unable to provide the service due to
            unforeseen circumstances, we will provide a full refund of any
            advance payment made.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            3. Refund Process
          </h2>
          <p>
            Refunds, if applicable, will be processed within 5-7 working days
            and will be credited back to the original payment method used at the
            time of booking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            4. Modification of Booking
          </h2>
          <p>
            Any modification to a booking (change of date, time, or vehicle
            type) may be subject to availability and additional charges.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            5. Contact for Refunds
          </h2>
          <p>
            For any refund-related queries, please contact us at
            info.pentacab@gmail.com or call us at +91 7600839900.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
