// src/app/privacy-policy/page.tsx
"use client";

import React from "react";
import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="December 18, 2024">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            1. Introduction
          </h2>
          <p>
            Penta Cab ("we", "our", or "us") is committed to protecting your
            privacy. This Privacy Policy explains how your personal information
            is collected, used, and disclosed by Penta Cab.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            2. Information We Collect
          </h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Book a cab through our website or phone.</li>
            <li>Contact our customer support.</li>
            <li>Fill out a form on our website.</li>
          </ul>
          <p className="mt-2">
            The types of information we may collect include your name, email
            address, phone number, and location details for pickup and drop-off.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process your bookings and send related information.</li>
            <li>Send you technical notices, updates, and support messages.</li>
            <li>Respond to your comments and questions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            4. Data Sharing and Disclosure
          </h2>
          <p>
            We do not share your personal information with third parties except
            as necessary to provide our services (e.g., sharing your pickup
            location with the assigned driver) or as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            5. Data Security
          </h2>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, and unauthorized access, disclosure,
            alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#d4af37" }}>
            6. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="mt-2">
            Email: info.pentacab@gmail.com
            <br />
            Phone: +91 7600839900
            <br />
            Address: Shop no 2, Penta cab Taxi service, Khodiyar nagar society
            Opp avsar party plote Behind hansol gaun Hansol airport road
            Sardarnagar Ahmedabad
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
