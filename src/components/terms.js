import React from "react";
import { Link } from "react-router-dom";

export default function Termsss() {
  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* === Decorative Background (same vibe as your Login page) === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />

        {/* Blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-200 blur-3xl opacity-50" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-emerald-300 blur-3xl opacity-40" />
        <div className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[60rem] rounded-[50%] bg-emerald-100 blur-3xl opacity-40" />

        {/* Subtle grid pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="terms-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-700/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terms-grid)" />
        </svg>

        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      {/* Page container */}
      <div className="w-full max-w-6xl mx-auto px-4 py-10">
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#128f8b] via-[#0e7d7a] to-[#0e6b69] text-white shadow-lg mb-8">
          <div className="p-6 md:p-8">
            <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms &amp; Conditions</h1>
                <p className="mt-2 text-white/90">
                  Last updated: <span className="font-semibold">August 11, 2025</span>
                </p>
                <p className="mt-4 max-w-3xl text-white/90">
                  These Terms &amp; Conditions (“Terms”) govern your access to and use of the{" "}
                  <span className="font-semibold">[Your Brand Name]</span> website, mobile experiences, and related
                  services (collectively, the “Service”). By creating an account or using the Service, you agree to be
                  bound by these Terms. If you do not agree, please do not use the Service.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  Clear • Fair • Transparent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content grid: quick nav + sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Navigation */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border bg-white/70 backdrop-blur-md shadow-sm p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Navigation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
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
                    <a
                      key={i}
                      href={`#sec-${i + 1}`}
                      className="text-sm text-emerald-900 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-700/30 hover:decoration-emerald-700 transition"
                    >
                      {i + 1}. {t}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Sections */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* 1 */}
            <div id="sec-1" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1) Eligibility &amp; Accounts</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>You must be at least 18 years old to create an account and use the Service.</li>
                <li>
                  You agree to provide accurate, current, and complete information during registration and keep it
                  updated (e.g., name, email, phone, NID, organization details).
                </li>
                <li>You are responsible for maintaining the confidentiality of your credentials and all activities under your account.</li>
                <li>We may refuse, suspend, or terminate accounts at our discretion, including suspected fraud, misuse, or policy violations.</li>
              </ul>
            </div>

            {/* 2 */}
            <div id="sec-2" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2) Organizer Responsibilities</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>Ensure the accuracy and legality of your event details (title, time, venue, capacity, age limits, permits, etc.).</li>
                <li>Obtain all required permissions, licenses, and approvals for your event.</li>
                <li>Comply with all applicable laws and regulations of Bangladesh and local authorities.</li>
                <li>Provide timely updates for postponements, cancellations, or material changes.</li>
                <li>Treat attendees fairly; honor published policies for entry, seating, and accessibility.</li>
              </ul>
            </div>

            {/* 3 */}
            <div id="sec-3" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3) Event Listings &amp; Tickets</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>Listings must be truthful, non-misleading, and include all material terms (pricing, fees, restrictions).</li>
                <li>Ticket categories and quantities you set (e.g., VIP, Regular) must reflect actual availability.</li>
                <li>We may remove or edit listings that violate these Terms or applicable law.</li>
              </ul>
            </div>

            {/* 4 */}
            <div id="sec-4" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4) Payments, Fees &amp; Refunds</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>Payment processing may be provided by third-party processors. You authorize charges for tickets, service fees, taxes, and any applicable charges.</li>
                <li>Refunds and cancellation policies must be clearly stated on your event page. Organizers are responsible for honoring their stated policies.</li>
                <li>If you use our payout features, you authorize us to deduct applicable platform fees before settlement.</li>
                <li>For more details, see our <Link to="/refunds" className="underline text-emerald-800">Refund Policy</Link> (if applicable).</li>
              </ul>
            </div>

            {/* 5 */}
            <div id="sec-5" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5) Content &amp; Intellectual Property</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>
                  You retain ownership of content you submit (text, images, videos, logos). By submitting, you grant{" "}
                  <span className="font-semibold">[Your Brand Name]</span> a worldwide, non-exclusive, royalty-free
                  license to host, use, reproduce, modify, adapt, publish, and display such content for operating and
                  promoting the Service.
                </li>
                <li>You represent you have all rights to grant this license and that your content does not infringe others’ rights.</li>
                <li>All platform materials, trademarks, and software are owned by us or our licensors.</li>
                <li>If you believe content infringes your rights, contact us (see Contact section).</li>
              </ul>
            </div>

            {/* 6 */}
            <div id="sec-6" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6) Acceptable Use</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>No unlawful, harmful, defamatory, obscene, or fraudulent activity.</li>
                <li>No impersonation, scraping, data-mining, reverse engineering, or security circumvention.</li>
                <li>No spam, unauthorized advertising, or misuse of communications features.</li>
                <li>No uploading malware or content that violates privacy or IP rights.</li>
              </ul>
            </div>

            {/* 7 */}
            <div id="sec-7" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7) Privacy &amp; Communications</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>
                  Our handling of personal data is described in our{" "}
                  <Link to="/privacy" className="underline text-emerald-800">Privacy Policy</Link>.
                </li>
                <li>You consent to receive emails, calls, or SMS related to your account and events. You can opt out of marketing at any time.</li>
              </ul>
            </div>

            {/* 8 */}
            <div id="sec-8" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8) Third-Party Services</h2>
              <p className="text-gray-700">
                The Service may integrate third-party tools (e.g., payment gateways, maps, analytics). We are not
                responsible for third-party terms, privacy practices, or performance.
              </p>
            </div>

            {/* 9 */}
            <div id="sec-9" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9) Disclaimer of Warranties; Limitation of Liability</h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>The Service is provided “as is” and “as available” without warranties of any kind.</li>
                <li>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenues, data, or goodwill.</li>
              </ul>
            </div>

            {/* 10 */}
            <div id="sec-10" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10) Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless <span className="font-semibold">[Your Brand Name]</span>, its
                affiliates, and personnel from any claims, damages, liabilities, costs, and expenses arising from your
                content, events, or breach of these Terms.
              </p>
            </div>

            {/* 11 */}
            <div id="sec-11" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11) Termination</h2>
              <p className="text-gray-700">
                We may suspend or terminate access to the Service at any time, with or without notice, including for
                violations of these Terms. Upon termination, sections that by nature should survive (e.g., IP,
                disclaimers, liability limits) will survive.
              </p>
            </div>

            {/* 12 */}
            <div id="sec-12" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">12) Governing Law &amp; Dispute Resolution</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of the People’s Republic of Bangladesh. Courts located in{" "}
                <span className="font-semibold">Dhaka</span> shall have exclusive jurisdiction, unless applicable law
                requires otherwise. You agree to first attempt to resolve disputes informally by contacting us.
              </p>
            </div>

            {/* 13 */}
            <div id="sec-13" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">13) Changes to These Terms</h2>
              <p className="text-gray-700">
                We may update these Terms from time to time. Material changes will be posted on this page with a new
                “Last updated” date. Continued use after changes constitutes acceptance.
              </p>
            </div>

            {/* 14 */}
            <div id="sec-14" className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">14) Contact</h2>
              <p className="text-gray-700">
                <span className="font-semibold">[Your Brand Name]</span>
                <br />
                [Company Legal Name if different]
                <br />
                [Address Line, City, Postal Code, Country]
                <br />
                Email: <a href="mailto:[email protected]" className="underline text-emerald-800">[email protected]</a>
                <br />
                Phone: <a href="tel:+8801XXXXXXXXX" className="underline text-emerald-800">+8801XXXXXXXXX</a>
              </p>
            </div>

            {/* Acknowledgement */}
            <div className="rounded-2xl border bg-white/80 backdrop-blur-xl p-6 shadow-sm">
              <p className="text-gray-700">
                By using our Service you acknowledge that you have read, understood, and agreed to these Terms.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
