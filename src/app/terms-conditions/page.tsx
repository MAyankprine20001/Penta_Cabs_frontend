// src/app/terms-conditions/page.tsx
"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function TermsConditions() {
  return (
    <PolicyLayout title="Terms and Conditions" lastUpdated="December 18, 2024">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using the Penta Cab website and services, you agree
            to be bound by these Terms and Conditions. If you do not agree to
            these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            2. Booking and Services
          </h2>
          <p>
            Penta Cab provides taxi and car rental services. Bookings can be
            made through our website or by calling our customer support. We
            reserve the right to refuse service to anyone for any reason at any
            time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            3. User Responsibilities
          </h2>
          <p>Users agree to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Provide accurate and complete information when booking.</li>
            <li>
              Maintain the decorum and safety of the vehicle during the ride.
            </li>
            <li>Pay the agreed-upon fare for the services provided.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            4. Cancellation and Refunds
          </h2>
          <p>
            Cancellation of bookings may be subject to cancellation fees. Our
            Refund Policy (available on the website) governs the process for any
            refunds.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            5. Limitation of Liability
          </h2>
          <p>
            Penta Cab shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or any loss of profits or
            revenues, whether incurred directly or indirectly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            6. Governing Law
          </h2>
          <p>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of India, and any disputes shall be subject
            to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            7. Contact Information
          </h2>
          <p>
            For any queries regarding these terms, please contact us at
            info.pentacab@gmail.com.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
