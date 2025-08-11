import React from "react";
import { Link } from "react-router-dom";

export default function Termsss() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-white/80 mb-8">
          Last updated: <span className="font-semibold">August 11, 2025</span>
        </p>

        {/* Intro */}
        <p className="text-white/90 mb-6">
          These Terms & Conditions (“Terms”) govern your access to and use of the{" "}
          <span className="font-semibold">[Your Brand Name]</span> website, mobile
          experiences, and related services (collectively, the “Service”). By creating an
          account or using the Service, you agree to be bound by these Terms.
          If you do not agree, please do not use the Service.
        </p>

        {/* Quick nav */}
        <div className="grid md:grid-cols-2 gap-3 mb-10">
          {[
            "Eligibility & Accounts",
            "Organizer Responsibilities",
            "Event Listings & Tickets",
            "Payments, Fees & Refunds",
            "Content & IP Rights",
            "Acceptable Use",
            "Privacy & Communications",
            "Third-Party Services",
            "Disclaimer & Liability",
            "Indemnification",
            "Termination",
            "Governing Law & Disputes",
            "Changes to Terms",
            "Contact"
          ].map((t, i) => (
            <a key={i} href={`#sec-${i+1}`} className="text-white/90 underline underline-offset-4">
              {i+1}. {t}
            </a>
          ))}
        </div>

        {/* 1. Eligibility & Accounts */}
        <section id="sec-1" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">1) Eligibility & Accounts</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>You must be at least 18 years old to create an account and use the Service.</li>
            <li>
              You agree to provide accurate, current, and complete information during
              registration and keep it updated (e.g., name, email, phone, NID, organization details).
            </li>
            <li>You are responsible for maintaining the confidentiality of your credentials and all activities under your account.</li>
            <li>
              We may refuse, suspend, or terminate accounts at our discretion, including suspected
              fraud, misuse, or policy violations.
            </li>
          </ul>
        </section>

        {/* 2. Organizer Responsibilities */}
        <section id="sec-2" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">2) Organizer Responsibilities</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>Ensure the accuracy and legality of your event details (title, time, venue, capacity, age limits, permits, etc.).</li>
            <li>Obtain all required permissions, licenses, and approvals for your event.</li>
            <li>Comply with all applicable laws and regulations of Bangladesh and local authorities.</li>
            <li>Provide timely updates for postponements, cancellations, or material changes.</li>
            <li>Treat attendees fairly; honor published policies for entry, seating, and accessibility.</li>
          </ul>
        </section>

        {/* 3. Event Listings & Tickets */}
        <section id="sec-3" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">3) Event Listings & Tickets</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>Listings must be truthful, non-misleading, and include all material terms (pricing, fees, restrictions).</li>
            <li>Ticket categories and quantities you set (e.g., VIP, Regular) must reflect actual availability.</li>
            <li>We may remove or edit listings that violate these Terms or applicable law.</li>
          </ul>
        </section>

        {/* 4. Payments, Fees & Refunds */}
        <section id="sec-4" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">4) Payments, Fees & Refunds</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>
              Payment processing may be provided by third-party processors. You authorize
              charges for tickets, service fees, taxes, and any applicable charges.
            </li>
            <li>
              Refunds and cancellation policies must be clearly stated on your event page. Organizers
              are responsible for honoring their stated policies.
            </li>
            <li>
              If you use our payout features, you authorize us to deduct applicable platform fees before settlement.
            </li>
            <li>
              For more details, see our <Link to="/refunds" className="underline">Refund Policy</Link> (if applicable).
            </li>
          </ul>
        </section>

        {/* 5. Content & IP Rights */}
        <section id="sec-5" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">5) Content & Intellectual Property</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>
              You retain ownership of content you submit (text, images, videos, logos). By submitting,
              you grant <span className="font-semibold">[Your Brand Name]</span> a worldwide, non-exclusive,
              royalty-free license to host, use, reproduce, modify, adapt, publish, and display such content
              for operating and promoting the Service.
            </li>
            <li>You represent you have all rights to grant this license and that your content does not infringe others’ rights.</li>
            <li>All platform materials, trademarks, and software are owned by us or our licensors.</li>
            <li>If you believe content infringes your rights, contact us (see Contact section).</li>
          </ul>
        </section>

        {/* 6. Acceptable Use */}
        <section id="sec-6" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">6) Acceptable Use</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>No unlawful, harmful, defamatory, obscene, or fraudulent activity.</li>
            <li>No impersonation, scraping, data-mining, reverse engineering, or security circumvention.</li>
            <li>No spam, unauthorized advertising, or misuse of communications features.</li>
            <li>No uploading malware or content that violates privacy or IP rights.</li>
          </ul>
        </section>

        {/* 7. Privacy & Communications */}
        <section id="sec-7" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">7) Privacy & Communications</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>
              Our handling of personal data is described in our{" "}
              <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </li>
            <li>
              You consent to receive emails, calls, or SMS related to your account and events. You can opt out of marketing at any time.
            </li>
          </ul>
        </section>

        {/* 8. Third-Party Services */}
        <section id="sec-8" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">8) Third-Party Services</h2>
          <p className="text-white/90">
            The Service may integrate third-party tools (e.g., payment gateways, maps, analytics).
            We are not responsible for third-party terms, privacy practices, or performance.
          </p>
        </section>

        {/* 9. Disclaimer & Liability */}
        <section id="sec-9" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">9) Disclaimer of Warranties; Limitation of Liability</h2>
          <ul className="list-disc ml-6 space-y-2 text-white/90">
            <li>The Service is provided “as is” and “as available” without warranties of any kind.</li>
            <li>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or for lost profits, revenues, data, or goodwill.
            </li>
          </ul>
        </section>

        {/* 10. Indemnification */}
        <section id="sec-10" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">10) Indemnification</h2>
          <p className="text-white/90">
            You agree to indemnify and hold harmless <span className="font-semibold">[Your Brand Name]</span>,
            its affiliates, and personnel from any claims, damages, liabilities, costs, and expenses
            arising from your content, events, or breach of these Terms.
          </p>
        </section>

        {/* 11. Termination */}
        <section id="sec-11" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">11) Termination</h2>
          <p className="text-white/90">
            We may suspend or terminate access to the Service at any time, with or without notice,
            including for violations of these Terms. Upon termination, sections that by nature should
            survive (e.g., IP, disclaimers, liability limits) will survive.
          </p>
        </section>

        {/* 12. Governing Law & Disputes */}
        <section id="sec-12" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">12) Governing Law & Dispute Resolution</h2>
          <p className="text-white/90">
            These Terms are governed by the laws of the People’s Republic of Bangladesh.
            Courts located in <span className="font-semibold">Dhaka</span> shall have exclusive jurisdiction,
            unless applicable law requires otherwise. You agree to first attempt to resolve disputes
            informally by contacting us.
          </p>
        </section>

        {/* 13. Changes to Terms */}
        <section id="sec-13" className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">13) Changes to These Terms</h2>
          <p className="text-white/90">
            We may update these Terms from time to time. Material changes will be posted on this page
            with a new “Last updated” date. Continued use after changes constitutes acceptance.
          </p>
        </section>

        {/* 14. Contact */}
        <section id="sec-14" className="mb-2">
          <h2 className="text-2xl font-semibold mb-2">14) Contact</h2>
          <p className="text-white/90">
            <span className="font-semibold">[Your Brand Name]</span><br />
            [Company Legal Name if different]<br />
            [Address Line, City, Postal Code, Country]<br />
            Email: <a href="mailto:[email protected]" className="underline">[email protected]</a><br />
            Phone: <a href="tel:+8801XXXXXXXXX" className="underline">+8801XXXXXXXXX</a>
          </p>
        </section>

        <div className="mt-8 text-white/80">
          By using our Service you acknowledge that you have read, understood, and agreed to these Terms.
        </div>
      </div>
    </div>
  );
}

